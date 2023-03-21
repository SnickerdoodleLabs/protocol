import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import {
  EVMContractAddress,
  IBlockchainError,
  BaseURI,
  RewardsFactoryError,
  ECreatedRewardType,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import {
  ContractOverrides,
  IRewardsContractFactory,
} from "@contracts-sdk/interfaces/index.js";
import { GasUtils } from "@contracts-sdk/implementations/GasUtils";

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
    overrides: ContractOverrides | null = null,
  ): ResultAsync<EVMContractAddress, RewardsFactoryError> {
    return GasUtils.getGasFee<RewardsFactoryError>(
      this.providerOrSigner,
    ).andThen((gasFee) => {
      return ResultAsync.fromPromise(
        this.contractFactory.deploy(symbol, name, baseURI, {
          ...gasFee,
          ...overrides,
        }),
        (e) => {
          return new RewardsFactoryError(
            "Failed to deploy contract",
            (e as IBlockchainError).reason,
            e,
          );
        },
      ).andThen((contract) => {
        return ResultAsync.fromPromise(
          contract.deployTransaction.wait(),
          (e) => {
            return new RewardsFactoryError(
              "Failed to wait() for contract deployment",
              (e as IBlockchainError).reason,
              e,
            );
          },
        ).map((receipt) => {
          return EVMContractAddress(receipt.contractAddress);
        });
      });
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
}
