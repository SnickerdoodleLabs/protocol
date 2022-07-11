import { Runtime } from "webextension-polyfill";
import { errAsync, okAsync } from "neverthrow";
import { IPortConnectionRepository } from "@interfaces/data";
import { IContextProvider } from "@interfaces/utilities";
import { IRpcEngineFactory } from "@interfaces/utilities/factory";
import {
  EConnectionModes,
  EPortNames,
  INTERNAL_PORTS,
  CONTENT_SCRIPT_SUBSTREAM,
  ONBOARDING_PROVIDER_SUBSTREAM,
  EXTERNAL_PORTS,
} from "@shared/constants/ports";
import Config from "@shared/constants/Config";
import { URLString } from "@snickerdoodlelabs/objects";
import PortStream from "extension-port-stream";
import ObjectMultiplex from "obj-multiplex";
import pump from "pump";
export class PortConnectionRepository implements IPortConnectionRepository {
  constructor(
    protected contextProvider: IContextProvider,
    protected rpcEngineFactory: IRpcEngineFactory,
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
      EConnectionModes.SD_INTERNAL,
      portStream,
    );
  }

  private _setupExternalConnection(remotePort: Runtime.Port) {
    const url = new URL(remotePort!.sender!.url!);
    const { origin } = url;

    const { origin: onboardingUrlOrigin } = new URL(Config.onboardingUrl);

    const portStream = new PortStream(remotePort);
    // create multiplex to enable substreams
    const portStreamMux = new ObjectMultiplex();
    // pipe port stream to multiplexer
    pump(portStream, portStreamMux, portStream);
    // create content script handler
    this.rpcEngineFactory.createRrpcEngine(
      remotePort,
      origin as URLString,
      EConnectionModes.EXTERNAL,
      portStreamMux.createStream(CONTENT_SCRIPT_SUBSTREAM),
    );

    // create injected onboarding handler if orgins match
    if (origin === onboardingUrlOrigin) {
      this.rpcEngineFactory.createRrpcEngine(
        remotePort,
        origin as URLString,
        EConnectionModes.EXTERNAL,
        portStreamMux.createStream(ONBOARDING_PROVIDER_SUBSTREAM),
      );
    }
  }
}
