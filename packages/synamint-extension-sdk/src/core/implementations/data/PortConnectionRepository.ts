import { URLString } from "@snickerdoodlelabs/objects";
import endOfStream from "end-of-stream";
import PortStream from "extension-port-stream";
import { inject, injectable } from "inversify";
import { errAsync, okAsync } from "neverthrow";
import ObjectMultiplex from "obj-multiplex";
import pump from "pump";
import { Runtime } from "webextension-polyfill";

import { IPortConnectionRepository } from "@synamint-extension-sdk/core/interfaces/data";
import {
  IContextProvider,
  IContextProviderType,
  IConfigProvider,
  IConfigProviderType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import {
  IRpcEngineFactory,
  IRpcEngineFactoryType,
} from "@synamint-extension-sdk/core/interfaces/utilities/factory";
import {
  EPortNames,
  INTERNAL_PORTS,
  CONTENT_SCRIPT_SUBSTREAM,
  ONBOARDING_PROVIDER_SUBSTREAM,
  EXTERNAL_PORTS,
  ERequestChannel,
} from "@synamint-extension-sdk/shared";

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
    }
    return okAsync(undefined);
  }

  private _setupInternalConnection(remotePort: Runtime.Port) {
    const portStream = new PortStream(remotePort);
    this.rpcEngineFactory.createRpcEngine(
      remotePort,
      remotePort.name as EPortNames,
      portStream,
      ERequestChannel.INTERNAL,
    );
  }

  private _setupExternalConnection(remotePort: Runtime.Port) {
    const url = new URL(remotePort!.sender!.url!);
    const { origin } = url;
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
      ERequestChannel.INTERNAL,
    );
    // create injected proxy handler
    this.rpcEngineFactory.createRpcEngine(
      remotePort,
      origin as URLString,
      portStreamMux.createStream(ONBOARDING_PROVIDER_SUBSTREAM),
      ERequestChannel.PROXY,
    );

    endOfStream(portStream, () => {
      portStreamMux.destroy();
    });
  }
}
