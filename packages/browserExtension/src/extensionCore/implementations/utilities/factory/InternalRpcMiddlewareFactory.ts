import { IContextProvider } from "@interfaces/utilities";
import { IInternalRpcMiddlewareFactory } from "@interfaces/utilities/factory";
import { createAsyncMiddleware } from "json-rpc-engine";
import {} from "@constants/actionTypes";

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
        case "login":
          await this.promisify(req, res, events.onLoginRequest);
          break;
        case "getSignatureMessage":
          await this.promisify(req, res, events.onLoginMessageRequest);
          break;
        case "addAccount":
          await this.promisify(req, res, events.onAccountAdded);
          break;
        default:
          await next();
      }
    });
  }
}
