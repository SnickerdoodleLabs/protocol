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
import { ResultAsync } from "neverthrow";

@injectable()
export class RewardsContractFactory implements IRewardsContractFactory {
  protected contractFactory: ethers.ContractFactory;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    public contractAddress: EVMContractAddress, // null to account for deploying a new contract
  ) {
    this.contractFactory = new ethers.ContractFactory(
      ContractsAbis.ERC721Reward.abi,
      ContractsAbis.ERC721Reward.bytecode,
      providerOrSigner as ethers.Wallet,
    );
  }

  // function to deploy a new ERC721 reward contract
  public deployERC721Reward(
    name: string,
    symbol: string,
    baseURI: BaseURI,
  ): ResultAsync<EVMContractAddress, RewardsFactoryError> {
    return ResultAsync.fromPromise(
      this.contractFactory.deploy(symbol, name, baseURI, {
        gasLimit: "5000000", //required to help overcome deployment gas estimation on ethers
      }),
      (e) => {
        return new RewardsFactoryError(
          "Failed to deploy contract",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).andThen((contract) => {
      return ResultAsync.fromPromise(contract.deployTransaction.wait(), (e) => {
        return new RewardsFactoryError(
          "Failed to wait() for contract deployment",
          (e as IBlockchainError).reason,
          e,
        );
      }).map((receipt) => {
        return EVMContractAddress(receipt.contractAddress);
      });
    });
  }
}
