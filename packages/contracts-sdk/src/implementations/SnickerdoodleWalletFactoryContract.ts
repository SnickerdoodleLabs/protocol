import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  SnickerdoodleWalletFactoryContractError,
  LayerZeroEndpointId,
  TokenAmount,
  InvalidParametersError,
  PasskeyId,
  PasskeyPublicKeyPointX,
  PasskeyPublicKeyPointY,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
  ISnickerdoodleWalletFactoryContract,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis, OperatorAndPoint } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class SnickerdoodleWalletFactoryContract
  extends BaseContract<SnickerdoodleWalletFactoryContractError>
  implements ISnickerdoodleWalletFactoryContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
  ) {
    super(
      providerOrSigner,
      contractAddress,
      ContractsAbis.SnickerdoodleWalletFactoryAbi.abi,
    );
  }

  public beaconAddress(): ResultAsync<
    EVMContractAddress,
    SnickerdoodleWalletFactoryContractError | BlockchainCommonErrors
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
    SnickerdoodleWalletFactoryAddress: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletFactoryContractError
  > {
    return this.writeToContract(
      "setPeer",
      [layerZeroEndpointId, SnickerdoodleWalletFactoryAddress],
      overrides,
    );
  }

  public peers(
    destinationChainEid: LayerZeroEndpointId,
  ): ResultAsync<
    EVMContractAddress,
    | SnickerdoodleWalletFactoryContractError
    | BlockchainCommonErrors
    | InvalidParametersError
  > {
    return ResultAsync.fromPromise(
      this.contract.peers(destinationChainEid) as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(e, "Unable to call peers()");
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

  public computeSnickerdoodleWalletProxyAddress(
    name: string,
  ): ResultAsync<
    EVMContractAddress,
    SnickerdoodleWalletFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.computeSnickerdoodleWalletProxyAddress(
        name,
      ) as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call computeSnickerdoodleWalletProxyAddress()",
        );
      },
    );
  }

  public quoteClaimSnickerdoodleWalletOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    operator: EVMAccountAddress | EVMContractAddress,
    x: PasskeyPublicKeyPointX,
    y: PasskeyPublicKeyPointY,
    keyId: PasskeyId,
    smartWalletAddress: EVMContractAddress,
    gas: bigint,
  ): ResultAsync<
    TokenAmount,
    SnickerdoodleWalletFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.quoteClaimSnickerdoodleWalletOnDestinationChain(
        destinationLayerZeroEndpointId,
        operator,
        x,
        y,
        keyId,
        smartWalletAddress,
        gas, // A minimum gas value to carry out the handler function for the contract's _handleClaimSmartWalletOnDestinationChain()
      ) as Promise<TokenAmount[]>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call quoteClaimSnickerdoodleWalletOnDestinationChain()",
        );
      },
    ).map((quotedFee) => {
      // The quoted fee is returned as fee in [native token, layer zero token]
      // We only need the native token fee amount
      return quotedFee[0];
    });
  }

  public deploySnickerdoodleWalletUpgradeableBeacon(
    name: string,
    x: PasskeyPublicKeyPointX,
    y: PasskeyPublicKeyPointY,
    keyId: PasskeyId,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletFactoryContractError
  > {
    return this.writeToContract(
      "deploySnickerdoodleWalletUpgradeableBeacon",
      [name, x, y, keyId],
      overrides,
    );
  }

  // Value calculated from quote should be included in the contracts overrides
  public claimSnickerdoodleWalletOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    name: string,
    x: PasskeyPublicKeyPointX,
    y: PasskeyPublicKeyPointY,
    keyId: PasskeyId,
    gas: bigint,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletFactoryContractError
  > {
    return this.writeToContract(
      "claimSnickerdoodleWalletOnDestinationChain",
      [destinationLayerZeroEndpointId, name, x, y, keyId, gas],
      overrides,
    );
  }

  public getSnickerdoodleWalletToOperatorOwnerPoint(
    smartWalletAddress: EVMContractAddress,
  ): ResultAsync<
    OperatorAndPoint,
    SnickerdoodleWalletFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getSnickerdoodleWalletToOperatorOwnerPoint(
        smartWalletAddress,
      ) as Promise<OperatorAndPoint>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call getSnickerdoodleWalletToOperatorOwnerPoint()",
        );
      },
    );
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): SnickerdoodleWalletFactoryContractError {
    return new SnickerdoodleWalletFactoryContractError(msg, e, transaction);
  }
}
