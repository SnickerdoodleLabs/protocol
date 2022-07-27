import {
  JsonRpcRequest,
  PendingJsonRpcResponse,
  AsyncJsonRpcEngineNextCallback,
} from "json-rpc-engine";
import { Runtime } from "webextension-polyfill";

export interface IRpcCallHandler {
  handleRpcCall(
    req: JsonRpcRequest<unknown>,
    res: PendingJsonRpcResponse<unknown>,
    next: AsyncJsonRpcEngineNextCallback,
    sender: Runtime.MessageSender | undefined
  ): void;
}
