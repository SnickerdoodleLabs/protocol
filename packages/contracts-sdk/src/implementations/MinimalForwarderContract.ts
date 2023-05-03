import { WrappedTransactionResponseBuilder } from "@contracts-sdk/implementations/WrappedTransactionResponseBuilder";
import {
  ContractOverrides,
  IMinimalForwarderContract,
  IMinimalForwarderRequest,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import {
  EVMAccountAddress,
  EVMContractAddress,
  MinimalForwarderContractError,
  IBlockchainError,
  BigNumberString,
  Signature,
} from "@snickerdoodlelabs/objects";
import { BigNumber, ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class MinimalForwarderContract implements IMinimalForwarderContract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    contractAddress: EVMContractAddress,
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      ContractsAbis.MinimalForwarderAbi.abi,
      providerOrSigner,
    );
  }

  public getNonce(
    from: EVMAccountAddress,
  ): ResultAsync<BigNumberString, MinimalForwarderContractError> {
    return ResultAsync.fromPromise(
      this.contract.getNonce(from) as Promise<BigNumber>,
      (e) => {
        return new MinimalForwarderContractError(
          `Unable to call getNonce(${from})`,
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((nonce) => {
      return BigNumberString(nonce.toString());
    });
  }

  public verify(
    request: IMinimalForwarderRequest,
    signature: Signature,
  ): ResultAsync<boolean, MinimalForwarderContractError> {
    return ResultAsync.fromPromise(
      this.contract.verify(request, signature) as Promise<boolean>,
      (e) => {
        return new MinimalForwarderContractError(
          `Unable to call verify()`,
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public execute(
    request: IMinimalForwarderRequest,
    signature: Signature,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, MinimalForwarderContractError> {
    return this.writeToContract("execute", [request, signature, overrides]);
  }

  public getContract(): ethers.Contract {
    return this.contract;
  }

  // Takes the MinimalForwarder Reward contract's function name and params, submits the transaction and returns a WrappedTransactionResponse
  protected writeToContract(
    functionName: string,
    functionParams: any[],
  ): ResultAsync<WrappedTransactionResponse, MinimalForwarderContractError> {
    return ResultAsync.fromPromise(
      this.contract[functionName](
        ...functionParams,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new MinimalForwarderContractError(
          `Unable to call ${functionName}()`,
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((tx) => {
      return this.toWrappedTransactionResponse(
        tx,
        functionName,
        functionParams,
      );
    });
  }

  protected toWrappedTransactionResponse(
    transactionResponse: ethers.providers.TransactionResponse,
    functionName: string,
    functionParams: any[],
  ): WrappedTransactionResponse {
    return WrappedTransactionResponseBuilder.buildWrappedTransactionResponse(
      transactionResponse,
      EVMContractAddress(this.contract.address),
      EVMAccountAddress((this.providerOrSigner as ethers.Wallet)?.address),
      functionName,
      functionParams,
      ContractsAbis.ConsentFactoryAbi.abi,
    );
  }
}
