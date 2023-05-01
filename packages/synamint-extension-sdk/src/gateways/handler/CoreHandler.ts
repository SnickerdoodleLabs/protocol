import { JsonRpcEngine, JsonRpcError, JsonRpcRequest } from "json-rpc-engine";
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

  public call<
    TParams extends CoreActionParams<ReturnType<TParams["returnMethodMarker"]>>,
  >(
    params: TParams,
  ): ResultAsync<ReturnType<TParams["returnMethodMarker"]>, JsonRpcError> {
    return ResultAsync.fromPromise(
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
      (e) => {
        return e as JsonRpcError;
      },
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
