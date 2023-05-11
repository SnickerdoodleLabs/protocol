import { GasUtils } from "@contracts-sdk/implementations/GasUtils";
import { WrappedTransactionResponseBuilder } from "@contracts-sdk/implementations/WrappedTransactionResponseBuilder";
import {
  ContractOverrides,
  IRewardsContractFactory,
} from "@contracts-sdk/interfaces/index.js";
import {
  ContractsAbis,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects";
import {
  EVMContractAddress,
  EVMAccountAddress,
  IBlockchainError,
  BaseURI,
  RewardsFactoryError,
  ECreatedRewardType,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class RewardsContractFactory implements IRewardsContractFactory {
  protected contractFactory: ethers.ContractFactory;
  protected rewardTypeToDeploy: ECreatedRewardType;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    protected rewardType: ECreatedRewardType,
  ) {
    // Set the correct contract factory based on rewardTypeToDeploy
    this.contractFactory = new ethers.ContractFactory(
      ContractsAbis.ERC721Reward.abi,
      ContractsAbis.ERC721Reward.bytecode,
      providerOrSigner as ethers.Wallet,
    );
    this.rewardTypeToDeploy = rewardType;
  }

  // function to deploy a new ERC721 reward contract
  public deployERC721Reward(
    name: string,
    symbol: string,
    baseURI: BaseURI,
    overrides: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, RewardsFactoryError> {
    return GasUtils.getGasFee<RewardsFactoryError>(
      this.providerOrSigner,
    ).andThen((gasFee) => {
      const contractOverrides = {
        ...gasFee,
        ...overrides,
      };
      return this.writeToContract(
        "deploy",
        [name, symbol, baseURI],
        contractOverrides,
      );
    });
  }

  public estimateGasToDeployERC721Contract(
    name: string,
    symbol: string,
    baseURI: BaseURI,
  ): ResultAsync<ethers.BigNumber, RewardsFactoryError> {
    return ResultAsync.fromPromise(
      this.providerOrSigner.estimateGas(
        this.contractFactory.getDeployTransaction(name, symbol, baseURI),
      ),
      (e) => {
        return new RewardsFactoryError(
          "Failed to wait() for contract deployment",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((estimatedGas) => {
      // Increase estimated gas buffer by 20%
      return estimatedGas.mul(120).div(100);
    });
  }

  // Takes the ERC721 factory's function name and params, submits the transaction and returns a WrappedTransactionResponse
  protected writeToContract(
    functionName: string,
    functionParams: any[],
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, RewardsFactoryError> {
    return ResultAsync.fromPromise(
      this.contractFactory[functionName](...functionParams, {
        ...overrides,
      }) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new RewardsFactoryError(
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
      EVMContractAddress(""),
      EVMAccountAddress((this.providerOrSigner as ethers.Wallet)?.address),
      functionName,
      functionParams,
      ContractsAbis.ConsentFactoryAbi.abi,
    );
  }
}
