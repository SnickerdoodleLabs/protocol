import { URLString } from "@snickerdoodlelabs/objects";
import endOfStream from "end-of-stream";
import { inject, injectable } from "inversify";
import { JsonRpcEngine, createAsyncMiddleware } from "json-rpc-engine";
import { createEngineStream } from "json-rpc-middleware-stream";
import { err, ok } from "neverthrow";
import pump from "pump";
import { Runtime } from "webextension-polyfill";

import { IRpcCallHandler, IRpcCallHandlerType } from "@synamint-extension-sdk/core/interfaces/api";
import { IContextProvider, IContextProviderType } from "@synamint-extension-sdk/core/interfaces/utilities";
import { IRpcEngineFactory } from "@synamint-extension-sdk/core/interfaces/utilities/factory";
import { EPortNames } from "@synamint-extension-sdk/shared/enums/ports";

@injectable()
export class RpcEngineFactory implements IRpcEngineFactory {
  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IRpcCallHandlerType) protected rpcCallHandler: IRpcCallHandler,
  ) {}

  public createRpcEngine(
    remotePort: Runtime.Port,
    origin: EPortNames | URLString,
    stream: any,
  ) {
    // create rpc handler engine
    const rpcEngine = new JsonRpcEngine();
    // add middleware for handling rpc events
    rpcEngine.push(
      createAsyncMiddleware(async (req, res, next) => {
        await this.rpcCallHandler.handleRpcCall(
          req,
          res,
          next,
          remotePort.sender,
        );
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
