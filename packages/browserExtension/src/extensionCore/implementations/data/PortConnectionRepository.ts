import { Runtime } from "webextension-polyfill";
import { okAsync } from "neverthrow";
import { IPortConnectionRepository } from "@interfaces/data";
import { IContextProvider } from "@interfaces/utilities";

import { EPortNames, INTERNAL_PORTS } from "@constants/port";
import { IRpcEngineFactory } from "@interfaces/utilities/factory";

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
    }
    return okAsync(undefined);
  }

  private _setupInternalConnection(remotePort: Runtime.Port) {
    const engine = this.rpcEngineFactory.createRrpcEngine(remotePort);
    if (engine.isOk()) {
      // TODO add engine to context
      // update ui controller context
    }
  }

  private _setupExternalConnection(remotePort: Runtime.Port) {}
}
