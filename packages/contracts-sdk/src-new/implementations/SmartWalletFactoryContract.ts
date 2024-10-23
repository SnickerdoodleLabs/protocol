import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  SmartWalletFactoryContractError,
  LayerZeroEndpointId,
  LayerZeroOptions,
  TokenAmount,
  InvalidParametersError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

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

  public peers(
    destinationChainEid: LayerZeroEndpointId,
  ): ResultAsync<
    EVMContractAddress,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.peers(destinationChainEid) as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(e, "Unable to call beaconAddress()");
      },
    ).andThen((destinationChainContractAddress) => {
      if (destinationChainContractAddress == ethers.ZeroAddress) {
        return errAsync(
          new InvalidParametersError(
            "Endpoint Id provided is not set as a peer",
          ),
        );
      }
      return okAsync(destinationChainContractAddress);
    });
  }

  public computeSmartWalletProxyAddress(
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
          "Unable to call computeSmartWalletProxyAddress()",
        );
      },
    );
  }

  public quoteClaimSmartWalletOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    owner: EVMAccountAddress,
    smartWalletAddress: EVMContractAddress,
  ): ResultAsync<
    TokenAmount,
    SmartWalletFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.quoteClaimSmartWalletOnDestinationChain(
        destinationLayerZeroEndpointId,
        owner,
        smartWalletAddress,
        50000n, // A minimum gas value to carry out the handler function for the contract's _handleClaimSmartWalletOnDestinationChain()
        false, // Option to pay in layer zero tokens, set to false for now, only pay in native token price
      ) as Promise<TokenAmount[]>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call quoteClaimSmartWalletOnDestinationChain()",
        );
      },
    ).map((quotedFee) => {
      // The quoted fee is returned as fee in [native token, layer zero token]
      // We only need the native token fee amount
      return quotedFee[0];
    });
  }

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

  // Value calculated from quote should be included in the contracts overrides
  public claimSmartWalletOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    name: string,
    owner: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SmartWalletFactoryContractError
  > {
    return this.writeToContract(
      "deploySmartWalletUpgradeableBeacon",
      [destinationLayerZeroEndpointId, name, owner],
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
