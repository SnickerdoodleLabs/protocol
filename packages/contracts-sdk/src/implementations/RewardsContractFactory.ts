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

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { GasUtils } from "@contracts-sdk/implementations/GasUtils";
import {
  ContractOverrides,
  IRewardsContractFactory,
} from "@contracts-sdk/interfaces/index.js";
import {
  ContractsAbis,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class RewardsContractFactory
  extends BaseContract<RewardsFactoryError>
  implements IRewardsContractFactory
{
  protected contractFactory: ethers.ContractFactory;
  protected rewardTypeToDeploy: ECreatedRewardType;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    protected rewardType: ECreatedRewardType,
  ) {
    super(
      providerOrSigner,
      EVMContractAddress(ethers.constants.AddressZero), // The rewards contract factory deploys a new contract, hence doesn't have a contract address
      ContractsAbis.ERC721Reward.abi,
    );
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
      return this.writeToContractFactory(
        "deploy",
        [name, symbol, baseURI],
        contractOverrides,
        true,
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

  protected generateError(
    msg: string,
    reason: string | undefined,
    e: unknown,
  ): RewardsFactoryError {
    return new RewardsFactoryError(msg, reason, e);
  }

  // Takes the factory's deploy function name and params, submits the transaction and returns a WrappedTransactionResponse
  protected writeToContractFactory(
    functionName: string,
    functionParams: any[],
    overrides?: ContractOverrides,
    isDeployingContract?: boolean,
  ): ResultAsync<WrappedTransactionResponse, RewardsFactoryError> {
    return ResultAsync.fromPromise(
      this.contractFactory[functionName](...functionParams, {
        ...overrides,
      }) as Promise<ethers.providers.TransactionResponse | ethers.Contract>,
      (e) => {
        return new RewardsFactoryError(
          `Unable to call ${functionName}()`,
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((transactionResponse) => {
      // If we are deploying a contract, the deploy() call returns an ethers.Contract object and the txresponse is under the deployTransaction property
      return RewardsContractFactory.buildWrappedTransactionResponse(
        isDeployingContract == true
          ? (transactionResponse as ethers.Contract).deployTransaction
          : (transactionResponse as ethers.providers.TransactionResponse),
        EVMContractAddress(""),
        EVMAccountAddress((this.providerOrSigner as ethers.Wallet)?.address),
        functionName,
        functionParams,
        ContractsAbis.ConsentFactoryAbi.abi,
      );
    });
  }
}
