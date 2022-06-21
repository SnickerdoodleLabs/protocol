import { Runtime } from "webextension-polyfill";
import PortStream from "extension-port-stream";
import { createAsyncMiddleware, JsonRpcEngine } from "json-rpc-engine";
import { createEngineStream } from "json-rpc-middleware-stream";
import endOfStream from "end-of-stream";
import { okAsync } from "neverthrow";
import pump from "pump";

import { IPortConnectionRepository } from "@interfaces/data";
import { IContextProvider } from "@interfaces/utilities";

import { EPortNames, INTERNAL_PORTS } from "@constants/port";
import { IInternalRpcMiddlewareFactory } from "@interfaces/utilities/factory";

export class PortConnectionRepository implements IPortConnectionRepository {
  constructor(
    protected contextProvider: IContextProvider,
    protected rpcMiddlewareFactory: IInternalRpcMiddlewareFactory,
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
    // create stream duplex
    const portStream = new PortStream(remotePort);
    // create rpc handler engine
    const rpcEngine = new JsonRpcEngine();
    // add middleware for handling rpc events
    rpcEngine.push(this.rpcMiddlewareFactory.createMiddleware());
    // create rpc stream duplex

    setTimeout(()=>{rpcEngine.emit("notification", {a: "b"})}, 5000) 
    const providerStream = createEngineStream({ engine: rpcEngine });
    // pipe portStream to engineStream
    pump(portStream, providerStream, portStream, (error) => {
      console.log(error);
    });

    this.contextProvider.getPortEvents().map((portEvents) => {
      endOfStream(portStream, () => {
        console.log("port connection closed");
        portEvents.onPortConnectionDetached?.next(remotePort);
      });
    });

   
  }

  private _setupExternalConnection(remotePort: Runtime.Port) {}
}
