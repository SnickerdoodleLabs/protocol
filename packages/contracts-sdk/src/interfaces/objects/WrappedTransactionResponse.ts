import {
  EVMAccountAddress,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";

export class WrappedTransactionResponse {
  public constructor(
    public txResponse: ethers.providers.TransactionResponse,
    public contractAddress?: EVMContractAddress,
    public signerAddress?: EVMAccountAddress,
    public functionName?: string,
    public functionParams?: string,
    public abi?: string,
  ) {}

  wait(): Promise<ethers.providers.TransactionReceipt> {
    return this.txResponse.wait();
  }
}
