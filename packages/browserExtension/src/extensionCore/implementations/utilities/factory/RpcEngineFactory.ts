import { IContextProvider } from "@interfaces/utilities";
import { IRpcEngineFactory } from "@interfaces/utilities/factory";
import { Runtime } from "webextension-polyfill";
import endOfStream from "end-of-stream";
import { JsonRpcEngine } from "json-rpc-engine";
import { createEngineStream } from "json-rpc-middleware-stream";
import pump from "pump";
import { err, ok } from "neverthrow";
import { EPortNames } from "@shared/enums/ports";
import { URLString } from "@snickerdoodlelabs/objects";
import { createAsyncMiddleware } from "json-rpc-engine";
import { IRpcCallHandler } from "@interfaces/api";

export class RpcEngineFactory implements IRpcEngineFactory {
  constructor(
    protected contextProvider: IContextProvider,
    protected rpcCallHandler: IRpcCallHandler,
  ) {}

  public createRrpcEngine(
    remotePort: Runtime.Port,
    origin: EPortNames | URLString,
    stream: any,
  ) {
    // create rpc handler engine
    const rpcEngine = new JsonRpcEngine();
    // add middleware for handling rpc events
    rpcEngine.push(
      createAsyncMiddleware(async (req, res, next) => {
        await this.rpcCallHandler.handleRpcCall(req, res, next);
      }),
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
