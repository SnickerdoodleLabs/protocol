import { JsonRpcMiddleware } from "json-rpc-engine";

export interface IInternalRpcMiddlewareFactory {
  createMiddleware(): JsonRpcMiddleware<unknown, unknown>;
}
