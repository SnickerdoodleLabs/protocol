import { IRewardsContractFactory } from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import {
  EVMContractAddress,
  IBlockchainError,
  BaseURI,
  RewardsFactoryError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ECreatedRewardType } from "@snickerdoodlelabs/objects";

@injectable()
export class RewardsContractFactory implements IRewardsContractFactory {
  protected contractFactory: ethers.ContractFactory;
  protected rewardTypeToDeploy: ECreatedRewardType;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    protected rewardType: ECreatedRewardType
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
  ): ResultAsync<EVMContractAddress, RewardsFactoryError> {
    return this.estimateGasToDeployERC721Contract(name, symbol, baseURI).andThen(
      (bufferedGasLimit) => {
        return ResultAsync.fromPromise(
          this.contractFactory.deploy(symbol, name, baseURI, {
            gasLimit: bufferedGasLimit,
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
      },
    );
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
