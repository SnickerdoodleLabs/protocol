import { IContextProvider } from "@interfaces/utilities";
import { ClientEvents, IResolvers } from "@interfaces/objects";
import { IInternalRpcMiddlewareFactory } from "@interfaces/utilities/factory";
import { createAsyncMiddleware } from "json-rpc-engine";
import { EInternalActions } from "@shared/constants/actions";
import { ok } from "neverthrow";
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
        resolvers: { resolveResult, resolveError},
      });
    });
  }

  public createMiddleware() {
    let events: ClientEvents;
    this.contextProvider.getClientEvents().map((clientEvents) => {
      events = clientEvents;
      return ok(undefined);
    });
    return createAsyncMiddleware(async (req, res, next) => {
      switch (req.method) {
        case EInternalActions.LOGIN:
          await this.promisify(req, res, events.onLoginRequest);
          break;
        case EInternalActions.GET_LOGIN_MESSAGE:
          await this.promisify(req, res, events.onLoginMessageRequest);
          break;
        case EInternalActions.ADD_ACCOUNT:
          await this.promisify(req, res, events.onAddAccountRequest);
          break;
        default:
          await next();
      }
    });
  }
}
