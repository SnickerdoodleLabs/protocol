import {
  IBaseContract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/index.js";
import {
  EVMContractAddress,
  IBlockchainError,
  EVMAccountAddress,
  InsufficientFundsError,
  blockchainErrorMapping,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export abstract class BaseContract<TError> implements IBaseContract {
  protected contract: ethers.Contract;
  protected contractAbi: ethers.ContractInterface;

  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    protected contractAddress: EVMContractAddress,
    protected abi: ethers.ContractInterface,
  ) {
    this.contract = new ethers.Contract(contractAddress, abi, providerOrSigner);
    this.contractAbi = abi;
  }

  public getContractAddress(): EVMContractAddress {
    return this.contractAddress;
  }

  public getContract(): ethers.Contract {
    return this.contract;
  }

  //generateError, generates a T, Error

  //TODOSEAN: no longer needed
  /*  protected abstract generateError(
    msg: string,
    reason: string | undefined,
    e: unknown,
  ): TError; */

  // Takes the contract's function name and params, submits the transaction and returns a WrappedTransactionResponse
  protected writeToContract(
    functionName: string,
    functionParams: any[],
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, InsufficientFundsError> {
    return ResultAsync.fromPromise(
      this.contract[functionName](...functionParams, {
        ...overrides,
      }) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return e;
      },
    )
      .map((transactionResponse) => {
        return BaseContract.buildWrappedTransactionResponse(
          transactionResponse,
          EVMContractAddress(this.contract.address),
          EVMAccountAddress((this.providerOrSigner as ethers.Wallet)?.address),
          functionName,
          functionParams,
          this.contractAbi,
        );
      })
      .mapErr((e) => {
        return this.getBlockchainErrorType(e.reason);
      });
  }

  // Function to return the correct error type based on mapping of error message
  protected getBlockchainErrorType(
    reason: string | undefined,
  ): InsufficientFundsError {
    const errorType: Error | undefined = blockchainErrorMapping.get(reason ? reason : "");

    return new errorType(reason);
  }

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
      BaseContract.extractFunctionAbi(functionName, contractAbi),
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
