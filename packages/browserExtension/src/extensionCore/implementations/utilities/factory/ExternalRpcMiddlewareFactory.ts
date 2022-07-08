import { IContextProvider } from "@interfaces/utilities";
import { createAsyncMiddleware } from "json-rpc-engine";
import { IExternalRpcMiddlewareFactory } from "@interfaces/utilities/factory/IExternalRpcMiddlewareFactory";
import { EExternalActions } from "@shared/constants/actions";
import { Subject } from "rxjs";
import { IResolvers } from "@interfaces/objects";
export class ExternalRpcMiddlewareFactory
  implements IExternalRpcMiddlewareFactory
{
  constructor(protected contextProvider: IContextProvider) {}

  private promisify(
    req,
    res,
    observable: Subject<{ params: any; resolvers: IResolvers }>,
  ) {
    return new Promise((resolve) => {
      const resolveResult = (result) => {
        res.result = result;
        resolve(result);
      };
      const resolveError = (error) => {
        res.error = error;
        resolve(error);
      };
      observable.next({
        params: req.params,
        resolvers: { resolveResult, resolveError },
      });
    });
  }
  public createMiddleware() {
    const clientEvents = this.contextProvider.getClientEvents();
    return createAsyncMiddleware(async (req, res, next) => {
      switch (req.method) {
        case EExternalActions.GET_STATE:
          res.result = this.contextProvider.getExterenalState();
          break;
        case EExternalActions.ADD_ACCOUNT:
          await this.promisify(req, res, clientEvents.onAddAccountRequest);
          break;
        case EExternalActions.GET_UNLOCK_MESSAGE:
          await this.promisify(req, res, clientEvents.onUnlockMessageRequest);
          break;
        case EExternalActions.UNLOCK:
          await this.promisify(req, res, clientEvents.onUnlockRequest);
          break;
        default:
          await next();
      }
    });
  }
}
