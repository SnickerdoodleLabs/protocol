import { IAsyncRpcResponseSender } from "@interfaces/utilities/IAsyncRpcResponseSender";
import { DEFAULT_RPC_SUCCESS_RESULT } from "@shared/constants/rpcCall";
import { PendingJsonRpcResponse } from "json-rpc-engine";
import { okAsync, ResultAsync } from "neverthrow";

export class AsyncRpcResponseSender<T, K extends Error>
  implements IAsyncRpcResponseSender
{
  constructor(
    protected fn: ResultAsync<T, K>,
    protected res: PendingJsonRpcResponse<unknown>,
  ) {}
  public async call(): Promise<void> {
    await this.fn
      .mapErr((err) => {
        this.res.error = err as Error;
      })
      .map((result) => {
        if (typeof result === typeof undefined) {
          this.res.result = DEFAULT_RPC_SUCCESS_RESULT;
        } else {
          this.res.result = this.toObject(result);
        }
        return okAsync(undefined);
      });
  }
  toObject(result) {
    return JSON.parse(JSON.stringify(result, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    ));
}
}
