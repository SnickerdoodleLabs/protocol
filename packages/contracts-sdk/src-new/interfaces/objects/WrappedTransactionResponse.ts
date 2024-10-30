import {
  EVMAccountAddress,
  EVMContractAddress,
  IBlockchainError,
  TransactionResponseError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

export class WrappedTransactionResponse {
  public constructor(
    public txResponse: ethers.TransactionResponse,
    public contractAddress?: EVMContractAddress,
    public signerAddress?: EVMAccountAddress,
    public functionName?: string,
    public functionParams?: string,
    public abi?: string,
  ) {}

  wait(): ResultAsync<ethers.TransactionReceipt, TransactionResponseError> {
    return ResultAsync.fromPromise(this.txResponse.wait(), (e) => {
      return new TransactionResponseError(
        "Unable to call wait() for transaction response.",
        (e as IBlockchainError).reason,
      );
    }).andThen((receipt) => {
      if (receipt == null) {
        return errAsync(
          new TransactionResponseError(
            "Unable to call wait() for transaction response; receipt is null, indicating 0 confirmations.",
          ),
        );
      }

      return okAsync(receipt);
    });
  }
}
