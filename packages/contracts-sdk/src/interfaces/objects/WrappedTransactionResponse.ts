import {
  IBlockchainError,
  TransactionReceipt,
  TransactionResponseError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export class WrappedTransactionResponse {
  public constructor(public txResponse: ethers.providers.TransactionResponse) {}

  wait(): ResultAsync<
    ethers.providers.TransactionReceipt,
    TransactionResponseError
  > {
    return ResultAsync.fromPromise(this.txResponse.wait(), (e) => {
      return new TransactionResponseError(
        "Unable to call wait() for transaction response.",
        (e as IBlockchainError).reason,
      );
    });
  }
}
