import { ethers } from "ethers";
import { WrappedTransactionResponse } from "@contracts-sdk/interfaces/objects/index.js";
import { injectable } from "inversify";
import {
  EVMAccountAddress,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";

@injectable()
export class WrappedTransactionResponseBuilder {
  static buildWrappedTransactionResponse(
    transactionResponse: ethers.providers.TransactionResponse,
    contractAddress: EVMContractAddress,
    signerAddress: EVMAccountAddress,
    functionName: string,
    functionParams: any[],
    contractAbi: any,
  ): WrappedTransactionResponse {
    return new WrappedTransactionResponse(
      transactionResponse,
      contractAddress,
      signerAddress,
      functionName,
      JSON.stringify(functionParams || []),
      this.extractFunctionAbi(functionName, contractAbi),
    );
  }

  static extractFunctionAbi(functionName: string, contractAbi: any): string {
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
