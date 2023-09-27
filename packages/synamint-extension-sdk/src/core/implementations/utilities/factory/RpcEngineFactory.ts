import { URLString } from "@snickerdoodlelabs/objects";
import {
  IRpcCallHandler,
  IRpcCallHandlerType,
} from "@synamint-extension-sdk/core/interfaces/api";
import {
  IContextProvider,
  IContextProviderType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { IRpcEngineFactory } from "@synamint-extension-sdk/core/interfaces/utilities/factory";
import { ERequestChannel, EPortNames } from "@synamint-extension-sdk/shared";
import endOfStream from "end-of-stream";
import PortDuplexStream from "extension-port-stream";
import { inject, injectable } from "inversify";
import { JsonRpcEngine, createAsyncMiddleware } from "json-rpc-engine";
import { createEngineStream } from "json-rpc-middleware-stream";
import { Ok, err, ok } from "neverthrow";
import pump from "pump";
import { Duplex } from "readable-stream";
import { Runtime } from "webextension-polyfill";

@injectable()
export class RpcEngineFactory implements IRpcEngineFactory {
  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IRpcCallHandlerType) protected rpcCallHandler: IRpcCallHandler,
  ) {}

  public createRpcEngine(
    remotePort: Runtime.Port,
    origin: EPortNames | URLString,
    stream: Duplex | PortDuplexStream,
    requestChannel: ERequestChannel,
  ): Ok<JsonRpcEngine, never> {
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
          requestChannel,
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
