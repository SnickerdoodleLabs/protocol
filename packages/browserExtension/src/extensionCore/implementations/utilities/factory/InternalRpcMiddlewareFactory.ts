import { IContextProvider } from "@interfaces/utilities";
import { IResolvers } from "@interfaces/objects";
import { IInternalRpcMiddlewareFactory } from "@interfaces/utilities/factory";
import { createAsyncMiddleware } from "json-rpc-engine";
import { EInternalActions } from "@shared/constants/actions";
import { Subject } from "rxjs";

export class InternalRpcMiddlewareFactory
  implements IInternalRpcMiddlewareFactory
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
        case EInternalActions.LOGIN:
          await this.promisify(req, res, clientEvents.onLoginRequest);
          break;
        case EInternalActions.GET_LOGIN_MESSAGE:
          await this.promisify(req, res, clientEvents.onLoginMessageRequest);
          break;
        case EInternalActions.ADD_ACCOUNT:
          await this.promisify(req, res, clientEvents.onAddAccountRequest);
          break;
        default:
          await next();
      }
    });
  }
}
