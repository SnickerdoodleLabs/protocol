import { Runtime } from "webextension-polyfill";
import { errAsync, okAsync } from "neverthrow";
import { IPortConnectionRepository } from "@interfaces/data";
import { IContextProvider } from "@interfaces/utilities";
import { IRpcEngineFactory } from "@interfaces/utilities/factory";
import {
  EConnectionModes,
  EPortNames,
  INTERNAL_PORTS,
} from "@shared/constants/ports";
import { URLString } from "@snickerdoodlelabs/objects";

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
    } else if (remotePort.sender?.tab && remotePort.sender.url) {
      this._setupExternalConnection(remotePort);
    } else {
      errAsync(undefined);
    }
    return okAsync(undefined);
  }

  private _setupInternalConnection(remotePort: Runtime.Port) {
    this.rpcEngineFactory.createRrpcEngine(
      remotePort,
      remotePort.name as EPortNames,
      EConnectionModes.SD_INTERNAL,
    );
  }

  private _setupExternalConnection(remotePort: Runtime.Port) {
    const url = new URL(remotePort!.sender!.url!);
    const { origin } = url;
    this.rpcEngineFactory.createRrpcEngine(
      remotePort,
      origin as URLString,
      EConnectionModes.EXTERNAL,
    );
  }
}
