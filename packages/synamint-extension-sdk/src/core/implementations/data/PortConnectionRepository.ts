import { URLString } from "@snickerdoodlelabs/objects";
import endOfStream from "end-of-stream";
import PortStream from "extension-port-stream";
import { inject, injectable } from "inversify";
import { errAsync, okAsync } from "neverthrow";
import ObjectMultiplex from "obj-multiplex";
import pump from "pump";
import { Runtime } from "webextension-polyfill";

import { IPortConnectionRepository } from "@synamint-extension-sdk/core/interfaces/data";
import { IContextProvider, IContextProviderType } from "@synamint-extension-sdk/core/interfaces/utilities";
import {
  IRpcEngineFactory,
  IRpcEngineFactoryType,
} from "@synamint-extension-sdk/core/interfaces/utilities/factory";
import {
  INTERNAL_PORTS,
  CONTENT_SCRIPT_SUBSTREAM,
  ONBOARDING_PROVIDER_SUBSTREAM,
  EXTERNAL_PORTS,
} from "@synamint-extension-sdk/shared/constants/ports";
import { EPortNames } from "@synamint-extension-sdk/shared/enums/ports";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@synamint-extension-sdk/shared/interfaces/configProvider";

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
    this.rpcEngineFactory.createRrpcEngine(
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
    this.rpcEngineFactory.createRrpcEngine(
      remotePort,
      origin as URLString,
      portStreamMux.createStream(CONTENT_SCRIPT_SUBSTREAM),
    );
    // create injected onboarding handler if orgins match
    if (origin === onboardingUrlOrigin) {
      this.rpcEngineFactory.createRrpcEngine(
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
