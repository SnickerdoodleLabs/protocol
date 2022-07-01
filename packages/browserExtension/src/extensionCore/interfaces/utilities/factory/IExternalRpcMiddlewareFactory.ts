import { JsonRpcMiddleware } from "json-rpc-engine";

export interface IExternalRpcMiddlewareFactory {
  createMiddleware(): JsonRpcMiddleware<unknown, unknown>;
}
