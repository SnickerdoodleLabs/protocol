import { IContextProvider } from "@interfaces/utilities";
import {
  IExternalRpcMiddlewareFactory,
  IInternalRpcMiddlewareFactory,
  IRpcEngineFactory,
} from "@interfaces/utilities/factory";
import { Runtime } from "webextension-polyfill";
import endOfStream from "end-of-stream";
import { JsonRpcEngine } from "json-rpc-engine";
import { createEngineStream } from "json-rpc-middleware-stream";
import pump from "pump";
import { err, ok } from "neverthrow";
import { EConnectionModes, EPortNames } from "@shared/constants/ports";
import { URLString } from "@snickerdoodlelabs/objects";

export class RpcEngineFactory implements IRpcEngineFactory {
  constructor(
    protected contextProvider: IContextProvider,
    protected internalRpcMiddlewareFactory: IInternalRpcMiddlewareFactory,
    protected externalRpcMiddlewareFactory: IExternalRpcMiddlewareFactory,
  ) {}

  public createRrpcEngine(
    remotePort: Runtime.Port,
    origin: EPortNames | URLString,
    mode: EConnectionModes,
    stream: any,
  ) {
    // create rpc handler engine
    const rpcEngine = new JsonRpcEngine();
    // add middleware for handling rpc events
    rpcEngine.push(
      (mode === EConnectionModes.EXTERNAL
        ? this.externalRpcMiddlewareFactory
        : this.internalRpcMiddlewareFactory
      ).createMiddleware(),
    );
    // create rpc stream duplex
    const engineStream = createEngineStream({ engine: rpcEngine });
    // pipe incoming stream to engineStream
    pump(stream, engineStream, stream, (error) => {
      err(error);
    });

    const appContext = this.contextProvider.getAppContext();
    const connectionId = appContext.addConnection(
      origin,
      remotePort.sender?.tab?.id,
      remotePort.sender?.tab?.windowId,
      rpcEngine,
    );

    endOfStream(stream, () => {
      connectionId && appContext.removeConnection(origin, connectionId);
    });
    return ok(rpcEngine);
  }
}
