import { JsonRpcEngine, JsonRpcRequest } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";
import { v4 } from "uuid";

import {
  CoreActionParams,
  DEFAULT_RPC_SUCCESS_RESULT,
} from "@synamint-extension-sdk/shared";

export default class CoreHandler {
  constructor(protected rpcEngine: JsonRpcEngine) {}

  public updateRpcEngine(rpcEngine: JsonRpcEngine) {
    this.rpcEngine = rpcEngine;
  }

  public call<T, K>(params: CoreActionParams): ResultAsync<T, K> {
    return ResultAsync.fromPromise<T, K>(
      new Promise((resolve, reject) => {
        const requestObject = this._createRequestObject(params);
        this.rpcEngine.handle(requestObject, async (error, result) => {
          console.log("callRes", result);
          console.log("callErr", error);
          if (error) {
            return reject(error);
          }
          return resolve(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - no type support provided
            result.result === DEFAULT_RPC_SUCCESS_RESULT
              ? // resolve void
                undefined
              : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore - no type support provided
                result.result,
          );
        });
      }),
      (e) => e as K,
    );
  }

  private _createRequestObject(params): JsonRpcRequest<unknown> {
    let requestObject = {
      id: v4(),
      jsonrpc: "2.0" as const,
      method: params.method,
    };
    if (params) {
      requestObject = Object.assign(requestObject, { params: params });
    }
    return requestObject;
  }
}
