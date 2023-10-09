import {
  JsonRpcRequest,
  PendingJsonRpcResponse,
  AsyncJsonRpcEngineNextCallback,
} from "json-rpc-engine";
import { Runtime } from "webextension-polyfill";

import { ERequestChannel } from "@synamint-extension-sdk/shared";

export interface IRpcCallHandler {
  handleRpcCall(
    req: JsonRpcRequest<unknown>,
    res: PendingJsonRpcResponse<unknown>,
    next: AsyncJsonRpcEngineNextCallback,
    sender: Runtime.MessageSender | undefined,
    requestChannel: ERequestChannel,
  ): void;
}

export const IRpcCallHandlerType = Symbol.for("IRpcCallHandler");
