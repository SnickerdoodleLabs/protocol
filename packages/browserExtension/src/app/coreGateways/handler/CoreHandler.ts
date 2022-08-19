import { JsonRpcEngine, JsonRpcRequest } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";
import { v4 } from "uuid";

export default class CoreHandler {
  constructor(protected rpcEngine: JsonRpcEngine) {}

  public call<T, K>(method, params?): ResultAsync<T, K> {
    return ResultAsync.fromPromise<T, K>(
      new Promise((resolve, reject) => {
        const requestObject = this._createRequestObject(method, params);
        this.rpcEngine.handle(requestObject, async (error, result) => {
          console.log("callRes", result);
          console.log("callErr", error);
          if (error) {
            return reject(error);
          }
          // @ts-ignore - no type support provided
          return resolve(result.result);
        });
      }),
      (e) => e as K,
    );
  }

  private _createRequestObject(method, params?): JsonRpcRequest<unknown> {
    let requestObject = { id: v4(), jsonrpc: "2.0" as const, method };
    if (params) {
      requestObject = Object.assign(requestObject, { params: params });
    }
    return requestObject;
  }
}
