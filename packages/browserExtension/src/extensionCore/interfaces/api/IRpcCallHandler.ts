import {
  JsonRpcRequest,
  PendingJsonRpcResponse,
  AsyncJsonRpcEngineNextCallback,
} from "json-rpc-engine";

export interface IRpcCallHandler {
  handleRpcCall(
    req: JsonRpcRequest<unknown>,
    res: PendingJsonRpcResponse<unknown>,
    next: AsyncJsonRpcEngineNextCallback,
  ): void;
}
