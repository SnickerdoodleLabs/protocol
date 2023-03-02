import { URLString } from "@snickerdoodlelabs/objects";
import endOfStream from "end-of-stream";
import PortStream from "extension-port-stream";

import { IPortConnectionRepository } from "@interfaces/data";

import { inject, injectable } from "inversify";

import { IContextProvider, IContextProviderType } from "@interfaces/utilities";

import { errAsync, okAsync } from "neverthrow";

import {
  IRpcEngineFactory,
  IRpcEngineFactoryType,
} from "@interfaces/utilities/factory";

import ObjectMultiplex from "obj-multiplex";

import {
  INTERNAL_PORTS,
  CONTENT_SCRIPT_SUBSTREAM,
  ONBOARDING_PROVIDER_SUBSTREAM,
  EXTERNAL_PORTS,
} from "@shared/constants/ports";

import pump from "pump";

import { EPortNames } from "@shared/enums/ports";

import { Runtime } from "webextension-polyfill";

import {
  IConfigProvider,
  IConfigProviderType,
} from "@shared/interfaces/configProvider";

@injectable()
export class PortConnectionRepository implements IPortConnectionRepository {
  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IRpcEngineFactoryType)
    protected rpcEngineFactory: IRpcEngineFactory,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public connectRemote(remotePort: Runtime.Port) {
    const processName = remotePort.name;
    // check proccess type
    const isInternal = INTERNAL_PORTS.includes(processName as EPortNames);
    if (isInternal) {
      this._setupInternalConnection(remotePort);
    } else if (
      EXTERNAL_PORTS.includes(processName as EPortNames) &&
      remotePort.sender?.tab &&
      remotePort.sender.url
    ) {
      this._setupExternalConnection(remotePort);
    } else {
      console.log("unknown port connected");
      errAsync(undefined);
    }
    return okAsync(undefined);
  }

  private _setupInternalConnection(remotePort: Runtime.Port) {
    const portStream = new PortStream(remotePort);
    this.rpcEngineFactory.createRpcEngine(
      remotePort,
      remotePort.name as EPortNames,
      portStream,
    );
  }

  private _setupExternalConnection(remotePort: Runtime.Port) {
    const url = new URL(remotePort!.sender!.url!);
    const { origin } = url;
    const onboardingUrl = this.configProvider.getConfig().onboardingUrl;
    const { origin: onboardingUrlOrigin } = new URL(onboardingUrl);

    const portStream = new PortStream(remotePort);

    // create multiplex to enable substreams
    const portStreamMux = new ObjectMultiplex();

    // pipe port stream to multiplexer
    pump(portStream, portStreamMux, portStream);

    // create content script handler
    this.rpcEngineFactory.createRpcEngine(
      remotePort,
      origin as URLString,
      portStreamMux.createStream(CONTENT_SCRIPT_SUBSTREAM),
    );

    // create injected onboarding handler if orgins match
    if (origin === onboardingUrlOrigin) {
      this.rpcEngineFactory.createRpcEngine(
        remotePort,
        origin as URLString,
        portStreamMux.createStream(ONBOARDING_PROVIDER_SUBSTREAM),
      );
    }
    endOfStream(portStream, () => {
      portStreamMux.destroy();
    });
  }
}
