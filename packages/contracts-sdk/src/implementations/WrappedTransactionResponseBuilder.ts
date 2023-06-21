import { WrappedTransactionResponse } from "@contracts-sdk/interfaces/objects/index.js";
import {
  EVMAccountAddress,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";

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
      WrappedTransactionResponseBuilder.extractFunctionAbi(
        functionName,
        contractAbi,
      ),
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
