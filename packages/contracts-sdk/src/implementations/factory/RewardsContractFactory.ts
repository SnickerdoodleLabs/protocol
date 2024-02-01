import {
  EVMContractAddress,
  EVMAccountAddress,
  BaseURI,
  RewardsFactoryError,
  ECreatedRewardType,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { GasUtils } from "@contracts-sdk/implementations/GasUtils.js";
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

    if (rewardType == ECreatedRewardType.ERC20) {
      this.contractFactory = new ethers.ContractFactory(
        ContractsAbis.ERC20Reward.abi,
        ContractsAbis.ERC20Reward.bytecode,
        providerOrSigner as ethers.Wallet,
      );
    }

    this.rewardTypeToDeploy = rewardType;
  }

  // function to deploy a new ERC721 reward contract
  public deployERC721Reward(
    name: string,
    symbol: string,
    baseURI: BaseURI,
    overrides: ContractOverrides,
    omitGasFee = false,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | RewardsFactoryError
  > {
    return GasUtils.getGasFee(this.providerOrSigner).andThen((gasFee) => {
      let contractOverrides = {
        ...gasFee,
        ...overrides,
      };

      // If the chain does not support EIP-1559, remove the gas fee override and only maintain the override passed in from the chain service
      if (omitGasFee == true) {
        contractOverrides = {
          ...overrides,
        };
      }

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
  ): ResultAsync<
    ethers.BigNumber,
    RewardsFactoryError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.providerOrSigner.estimateGas(
        this.contractFactory.getDeployTransaction(name, symbol, baseURI),
      ),
      (e) => {
        return this.generateError(
          e,
          "Failed to wait() for contract deployment",
        );
      },
    ).map((estimatedGas) => {
      // Increase estimated gas buffer by 20%
      return estimatedGas.mul(120).div(100);
    });
  }

  // function to deploy a new ERC721 reward contract
  public deployERC20Reward(
    name: string,
    symbol: string,
    overrides: ContractOverrides,
    omitGasFee = false,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | RewardsFactoryError
  > {
    return GasUtils.getGasFee(this.providerOrSigner).andThen((gasFee) => {
      let contractOverrides = {
        ...gasFee,
        ...overrides,
      };

      // If the chain does not support EIP-1559, remove the gas fee override and only maintain the override passed in from the chain service
      if (omitGasFee == true) {
        contractOverrides = {
          ...overrides,
        };
      }

      return this.writeToContractFactory(
        "deploy",
        [name, symbol],
        contractOverrides,
        true,
      );
    });
  }

  public estimateGasToDeployERC20Contract(
    name: string,
    symbol: string,
  ): ResultAsync<
    ethers.BigNumber,
    RewardsFactoryError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.providerOrSigner.estimateGas(
        this.contractFactory.getDeployTransaction(name, symbol),
      ),
      (e) => {
        return this.generateError(
          e,
          "Failed to wait() for contract deployment",
        );
      },
    ).map((estimatedGas) => {
      // Increase estimated gas buffer by 20%
      return estimatedGas.mul(120).div(100);
    });
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): RewardsFactoryError {
    return new RewardsFactoryError(msg, e, transaction);
  }

  // Takes the factory's deploy function name and params, submits the transaction and returns a WrappedTransactionResponse
  protected writeToContractFactory(
    functionName: string,
    functionParams: any[],
    overrides?: ContractOverrides,
    isDeployingContract?: boolean,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | RewardsFactoryError
  > {
    return ResultAsync.fromPromise(
      this.contractFactory[functionName](...functionParams, {
        ...overrides,
      }) as Promise<ethers.providers.TransactionResponse | ethers.Contract>,
      (e) => {
        return this.generateError(e, `Unable to call ${functionName}()`);
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
        ContractsAbis.ERC721Reward.abi,
      );
    });
  }
}
