import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  SmartWalletFactoryContractError,
  LayerZeroEndpointId,
  LayerZeroOptions,
  TokenAmount,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
  ISmartWalletFactoryContract,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class SmartWalletFactoryContract
  extends BaseContract<SmartWalletFactoryContractError>
  implements ISmartWalletFactoryContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
  ) {
    super(
      providerOrSigner,
      contractAddress,
      ContractsAbis.SmartWalletFactoryAbi.abi,
    );
  }

  public beaconAddress(): ResultAsync<
    EVMContractAddress,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.beaconAddress() as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(e, "Unable to call beaconAddress()");
      },
    );
  }

  public getSupportedChainEIDs(): ResultAsync<
    LayerZeroEndpointId[],
    SmartWalletFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getSupportedChainEIDs() as Promise<LayerZeroEndpointId[]>,
      (e) => {
        return this.generateError(e, "Unable to call getSupportedChainEIDs()");
      },
    );
  }

  public setPeer(
    layerZeroEndpointId: LayerZeroEndpointId,
    smartWalletFactoryAddress: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SmartWalletFactoryContractError
  > {
    return this.writeToContract(
      "setPeer",
      [layerZeroEndpointId, smartWalletFactoryAddress],
      overrides,
    );
  }

  public computeSmartWalletAddress(
    name: string,
  ): ResultAsync<
    EVMContractAddress,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.computeSmartWalletAddress(
        name,
      ) as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call computeSmartWalletAddress()",
        );
      },
    );
  }

  public quote(
    layerZeroEndpointId: LayerZeroEndpointId,
    owner: EVMAccountAddress,
    smartWalletAddress: EVMContractAddress,
    layerZeroOptions: string,
  ): ResultAsync<
    TokenAmount,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.quote(
        layerZeroEndpointId,
        owner,
        smartWalletAddress,
        layerZeroOptions,
        false, // Option to pay in layer zero tokens, set to false for now, only pay in native token price
      ) as Promise<TokenAmount>,
      (e) => {
        return this.generateError(e, "Unable to call quote()");
      },
    );
  }

  // Value calculated from quote should be included in the contracts overrides
  public deploySmartWalletUpgradeableBeacon(
    layerZeroEndpointId: LayerZeroEndpointId,
    name: string,
    owner: EVMAccountAddress,
    layerZeroOptions: LayerZeroOptions,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SmartWalletFactoryContractError
  > {
    return this.writeToContract(
      "deploySmartWalletUpgradeableBeacon",
      [layerZeroEndpointId, name, owner, layerZeroOptions],
      overrides,
    );
  }

  public getDeployedSmartWalletAddressToOwner(
    smartWalletAddress: EVMContractAddress,
  ): ResultAsync<
    EVMAccountAddress,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.deployedSmartWalletAddressToOwner(
        smartWalletAddress,
      ) as Promise<EVMAccountAddress>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call deployedSmartWalletAddressToOwner()",
        );
      },
    );
  }

  public getOwnerToDeployedSmartWalletAddressFlag(
    owner: EVMAccountAddress,
    smartWalletAddress: EVMContractAddress,
  ): ResultAsync<
    boolean,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.ownerToDeployedSmartWalletAddressFlag(
        owner,
        smartWalletAddress,
      ) as Promise<boolean>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call ownerToDeployedSmartWalletAddressFlag()",
        );
      },
    );
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): SmartWalletFactoryContractError {
    return new SmartWalletFactoryContractError(msg, e, transaction);
  }

  public filters = {
    Transfer: (
      fromAddress: EVMAccountAddress | null,
      toAddress: EVMAccountAddress | null,
    ): ethers.DeferredTopicFilter => {
      return this.contract.filters.Transfer(fromAddress, toAddress);
    },
  };
}
