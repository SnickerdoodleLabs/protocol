import { IContextProvider } from "@interfaces/utilities";
import { IInternalRpcMiddlewareFactory } from "@interfaces/utilities/factory";
import { Runtime } from "webextension-polyfill";
import PortStream from "extension-port-stream";
import { JsonRpcEngine } from "json-rpc-engine";
import { createEngineStream } from "json-rpc-middleware-stream";
import pump from "pump";
import { err, ok } from "neverthrow";

export class RpcEngineFactory {
  constructor(
    protected contextProvider: IContextProvider,
    protected rpcMiddlewareFactory: IInternalRpcMiddlewareFactory,
  ) {}

  public createRrpcEngine(remotePort: Runtime.Port) {
    // create stream duplex
    const portStream = new PortStream(remotePort);
    // create rpc handler engine
    const rpcEngine = new JsonRpcEngine();
    // add middleware for handling rpc events
    rpcEngine.push(this.rpcMiddlewareFactory.createMiddleware());
    // create rpc stream duplex
    const providerStream = createEngineStream({ engine: rpcEngine });
    // pipe portStream to engineStream
    pump(portStream, providerStream, portStream, (error) => {
      err(error);
    });
    return ok(rpcEngine);
  }
}
