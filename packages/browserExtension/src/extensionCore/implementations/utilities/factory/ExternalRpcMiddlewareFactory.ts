import { IContextProvider } from "@interfaces/utilities";
import { createAsyncMiddleware } from "json-rpc-engine";
import { IExternalRpcMiddlewareFactory } from "@interfaces/utilities/factory/IExternalRpcMiddlewareFactory";

export class ExternalRpcMiddlewareFactory
  implements IExternalRpcMiddlewareFactory
{
  constructor(protected contextProvider: IContextProvider) {}

  public createMiddleware() {
    return createAsyncMiddleware(async (req, res, next) => {
      switch (req.method) {
        default:
          await next();
      }
    });
  }
}
