import { JsonRpcEngine, JsonRpcRequest } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";

export default class CoreHandler {
  constructor(protected rpcEngine: JsonRpcEngine) {}

  public call<T>(method, params?): ResultAsync<T, unknown> {
    return ResultAsync.fromPromise<T, unknown>(
      new Promise((resolve, reject) => {
        const requestObject = this._createRequestObject(method, params);
        this.rpcEngine.handle(requestObject, async (error, result) => {
          if (error) {
            // @ts-ignore - no type support provided
            return reject(error ?? new Error());
          }
          // @ts-ignore - no type support provided
          return resolve(result.result);
        });
      }),
      (e) => console.log(e),
    );
  }

  private _createRequestObject(method, params?): JsonRpcRequest<unknown> {
    let requestObject = { id: Date.now(), jsonrpc: "2.0" as "2.0", method };
    if (params) {
      requestObject = Object.assign(requestObject, { params: params });
    }
    return requestObject;
  }
}
