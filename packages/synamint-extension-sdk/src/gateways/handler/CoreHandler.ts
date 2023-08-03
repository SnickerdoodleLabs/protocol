import { ProxyError } from "@snickerdoodlelabs/objects";
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

  public call<
    TParams extends CoreActionParams<ReturnType<TParams["returnMethodMarker"]>>,
  >(
    params: TParams,
  ): ResultAsync<ReturnType<TParams["returnMethodMarker"]>, ProxyError> {
    console.log("Calling Core!");
    return ResultAsync.fromPromise(
      new Promise((resolve, reject) => {
        console.log("params: " + params);
        console.log("JSON.stringify params: " + JSON.stringify(params));

        const requestObject = this._createRequestObject(params);
        console.log("requestObject: " + JSON.stringify(requestObject));

        this.rpcEngine.handle(requestObject, async (error, result) => {
          console.log("result: " + JSON.stringify(result));
          console.log("error: " + JSON.stringify(error));

          if (error) {
            console.log("We hit an error: ");
            return reject(error);
          }
          console.log("Hit resolve");
          console.log(
            "We hit a resolve: " +
              resolve(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore - no type support provided
                result.result === DEFAULT_RPC_SUCCESS_RESULT
                  ? // resolve void
                    undefined
                  : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore - no type support provided
                    result.result,
              ),
          );

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
        return new ProxyError("Error returned from core", e);
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
