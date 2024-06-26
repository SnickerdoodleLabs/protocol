import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import {
  EVMContractAddress,
  EVMAccountAddress,
  SignerUnavailableError,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  BlockchainErrorMapper,
  IEthersContractError,
} from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import {
  IBaseContract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export abstract class BaseContract<TContractSpecificError>
  implements IBaseContract
{
  protected contract: ethers.Contract;
  protected contractAbi: ethers.InterfaceAbi;
  protected hasSigner = false;

  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
    protected abi: ethers.InterfaceAbi,
  ) {
    this.contract = new ethers.Contract(contractAddress, abi, providerOrSigner);
    this.contractAbi = abi;
    // There used to be a method Signer.isSigner() that would do this, but it disappeared entirely in Ethers V6
    this.hasSigner = providerOrSigner["signMessage"] != null;
  }

  public getContractAddress(): EVMContractAddress {
    return this.contractAddress;
  }

  public getContract(): ethers.Contract {
    return this.contract;
  }

  protected ensureHasSigner(
    functionName: string,
  ): ResultAsync<void, BlockchainCommonErrors> {
    if (!this.hasSigner) {
      return errAsync(
        new SignerUnavailableError(
          `Cannot writeToContract function ${functionName}, no signer available. Contract wrapper is in read-only mode.`,
        ),
      );
    }
    return okAsync(undefined);
  }

  protected generateError(
    error: unknown,
    errorMessage: string,
  ): TContractSpecificError | BlockchainCommonErrors {
    return BlockchainErrorMapper.buildBlockchainError(
      error as IEthersContractError,
      (msg, err, transaction) =>
        this.generateContractSpecificError(msg, err, transaction || null),
    );
  }

  protected abstract generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): TContractSpecificError;

  // Takes the contract's function name and params, submits the transaction and returns a WrappedTransactionResponse
  protected writeToContract(
    functionName: string,
    functionParams: any[],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | TContractSpecificError
  > {
    return this.ensureHasSigner(functionName).andThen(() => {
      return ResultAsync.fromPromise(
        this.contract[functionName](...functionParams, {
          ...overrides,
        }) as Promise<ethers.TransactionResponse>,
        (e) => {
          return e as IEthersContractError;
        },
      )
        .map((transactionResponse) => {
          return BaseContract.buildWrappedTransactionResponse(
            transactionResponse,
            this.contractAddress,
            EVMAccountAddress(
              (this.providerOrSigner as ethers.Wallet)?.address,
            ),
            functionName,
            functionParams,
            this.contractAbi,
          );
        })
        .mapErr((e) => {
          return BlockchainErrorMapper.buildBlockchainError(
            e,
            (msg, reason, e) =>
              this.generateContractSpecificError(msg, reason, e || null),
          );
        });
    });
  }

  // Function to return the correct error type based on mapping of error message
  static buildWrappedTransactionResponse(
    transactionResponse: ethers.TransactionResponse,
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
      ObjectUtils.serialize(functionParams || []),
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
