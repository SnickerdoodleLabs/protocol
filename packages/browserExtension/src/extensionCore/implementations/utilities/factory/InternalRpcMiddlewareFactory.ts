import { IContextProvider } from "@interfaces/utilities";
import { IInternalRpcMiddlewareFactory } from "@interfaces/utilities/factory";
import { createAsyncMiddleware } from "json-rpc-engine";
import { EInternalActions } from "@shared/constants/actions";
export class InternalRpcMiddlewareFactory
  implements IInternalRpcMiddlewareFactory
{
  constructor(protected contextProvider: IContextProvider) {}

  private promisify(req, res, observable) {
    return new Promise((resolve, reject) => {
      const onResult = (result) => {
        res.result = result;
        resolve(result);
      };
      const onError = (error) => {
        res.error = error;
        resolve(error);
      };
      observable.next({ params: req.params, onResult, onError });
    });
  }

  public createMiddleware() {
    let events;
    this.contextProvider.getClientEvents().map((clientEvents) => {
      events = clientEvents;
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
          await this.promisify(req, res, events.onAccountAdded);
          break;
        default:
          await next();
      }
    });
  }
}
