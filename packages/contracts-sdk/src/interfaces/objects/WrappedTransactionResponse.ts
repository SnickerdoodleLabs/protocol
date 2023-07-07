import {
  EVMAccountAddress,
  EVMContractAddress,
  IBlockchainError,
  TransactionResponseError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export class WrappedTransactionResponse {
  public constructor(
    public txResponse: ethers.providers.TransactionResponse,
    public contractAddress?: EVMContractAddress,
    public signerAddress?: EVMAccountAddress,
    public functionName?: string,
    public functionParams?: string,
    public abi?: string,
  ) {}

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
