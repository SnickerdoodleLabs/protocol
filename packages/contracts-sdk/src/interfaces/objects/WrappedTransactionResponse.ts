import {
  IBlockchainError,
  TransactionReceipt,
  TransactionResponseError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export class WrappedTransactionResponse {
  public constructor(public txResponse: ethers.providers.TransactionResponse) {}

  wait(): Promise<ethers.providers.TransactionReceipt> {
    return this.txResponse.wait();
  }
}
