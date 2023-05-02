import { ethers } from "ethers";
import { WrappedTransactionResponse } from "@contracts-sdk/interfaces/objects/index.js";
import { injectable } from "inversify";
import {
  EVMAccountAddress,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";

@injectable()
export class WrappedTransactionResponseFactory {
  public constructor(
    protected transactionResponse: ethers.providers.TransactionResponse,
    protected contractAddress: EVMContractAddress,
    protected signerAddress: EVMAccountAddress,
    protected functionName: string,
    protected functionParams: any[],
    protected contractAbi: any,
  ) {}

  factoryWrappedTransactionResponse(): WrappedTransactionResponse {
    return new WrappedTransactionResponse(
      this.transactionResponse,
      this.contractAddress,
      this.signerAddress,
      this.functionName,
      JSON.stringify(this.functionParams || []),
      this.extractFunctionAbi(this.functionName, this.contractAbi),
    );
  }

  protected extractFunctionAbi(functionName: string, contractAbi: any): string {
    if (contractAbi == null || contractAbi.abi instanceof Array === false) {
      return "";
    }
    for (const item of contractAbi.abi) {
      if (item.type === "function" && item.name === functionName) {
        return item;
      }
    }
    return "";
  }
}
