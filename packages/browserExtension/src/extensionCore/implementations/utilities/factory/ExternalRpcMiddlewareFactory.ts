import { IContextProvider } from "@interfaces/utilities";
import { createAsyncMiddleware } from "json-rpc-engine";
import { IExternalRpcMiddlewareFactory } from "@interfaces/utilities/factory/IExternalRpcMiddlewareFactory";
import { ExternalActions } from "@shared/constants/actions";
export class ExternalRpcMiddlewareFactory
  implements IExternalRpcMiddlewareFactory
{
  constructor(protected contextProvider: IContextProvider) {}

  public createMiddleware() {
    return createAsyncMiddleware(async (req, res, next) => {
      switch (req.method) {
        case ExternalActions.GET_STATE:
          res.result = this.contextProvider.getExterenalState();
          break;
        default:
          await next();
      }
    });
  }
}
