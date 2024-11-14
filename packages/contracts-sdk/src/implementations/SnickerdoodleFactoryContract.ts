import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  SnickerdoodleFactoryContractError,
  LayerZeroEndpointId,
  TokenAmount,
  InvalidParametersError,
  P256PublicKeyComponents,
  OperatorDomain,
  SnickerdoodleWalletUsernameWithDomain,
  SnickerdoodleWalletUsername,
} from "@snickerdoodlelabs/objects";
import { BytesLike, ethers } from "ethers";
import { injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
  ISnickerdoodleFactoryContract,
} from "@contracts-sdk/interfaces/index.js";
import {
  ContractsAbis,
  P256KeyStruct,
} from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class SnickerdoodleWalletFactoryContract
  extends BaseContract<SnickerdoodleFactoryContractError>
  implements ISnickerdoodleFactoryContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
  ) {
    super(
      providerOrSigner,
      contractAddress,
      ContractsAbis.SnickerdoodleFactoryAbi.abi,
    );
  }

  public setPeer(
    layerZeroEndpointId: LayerZeroEndpointId,
    SnickerdoodleWalletFactoryAddress: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleFactoryContractError
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
    | SnickerdoodleFactoryContractError
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

  public walletBeaconAddress(): ResultAsync<
    EVMContractAddress,
    SnickerdoodleFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getWalletBeacon() as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(e, "Unable to call getWalletBeacon()");
      },
    );
  }

  public operatorGatewayBeaconAddress(): ResultAsync<
    EVMContractAddress,
    SnickerdoodleFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getGatewayBeacon() as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(e, "Unable to call getGatewayBeacon()");
      },
    );
  }

  public deployWalletProxies(
    usernames: SnickerdoodleWalletUsername[],
    p256Keys: P256KeyStruct[][],
    evmAccounts: EVMContractAddress[][] | EVMAccountAddress[][],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleFactoryContractError
  > {
    return this.writeToContract(
      "deployWalletProxies",
      [usernames, p256Keys, evmAccounts],
      overrides,
    );
  }

  public deployWalletProxy(
    username: SnickerdoodleWalletUsername,
    p256Keys: P256KeyStruct[],
    evmAccounts: EVMContractAddress[] | EVMAccountAddress[],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleFactoryContractError
  > {
    return this.writeToContract(
      "deployWalletProxy",
      [username, p256Keys, evmAccounts],
      overrides,
    );
  }

  public updateWalletHash(
    newWalletHash: BytesLike,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleFactoryContractError
  > {
    return this.writeToContract("updateWalletHash", [newWalletHash], overrides);
  }

  public deployOperatorGatewayProxy(
    domain: OperatorDomain,
    adminAccounts: EVMAccountAddress[] | EVMContractAddress[],
    operatorAccounts: EVMAccountAddress[] | EVMContractAddress[],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleFactoryContractError
  > {
    return this.writeToContract(
      "deployOperatorGatewayProxy",
      [domain, adminAccounts, operatorAccounts],
      overrides,
    );
  }

  public authorizeOperatorGatewayOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    domain: OperatorDomain,
    gas: bigint,
    nativeTokenFee: bigint, // Required fee calculated from the quoteAuthorizeOperatorGatewayOnDestinationChain function to be sent with the transaction to pay for the LayerZero _lzReceive() call
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleFactoryContractError
  > {
    // If there are no overrides provided, create an empty object
    const overridesWithFee = overrides ? overrides : ({} as ContractOverrides);

    // include the fee in the overrides object
    overridesWithFee.value = nativeTokenFee;

    return this.writeToContract(
      "authorizeGatewayOnDestinationChain",
      [destinationLayerZeroEndpointId, domain, gas],
      overrides,
    );
  }

  public quoteAuthorizeOperatorGatewayOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    domain: OperatorDomain,
    gas: bigint,
  ): ResultAsync<
    TokenAmount,
    SnickerdoodleFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.quoteAuthorizeOperatorGatewayOnDestinationChain(
        destinationLayerZeroEndpointId,
        domain,
        gas,
      ) as Promise<TokenAmount[]>,
      (e) => {
        return this.generateError(
          e,
          "Unable to call quoteAuthorizeOperatorGatewayOnDestinationChain()",
        );
      },
    ).map((quotedFee) => {
      // The quoted fee is returned as fee in [native token, layer zero token]
      // We only need the native token fee amount
      return quotedFee[0];
    });
  }

  public computeProxyAddress(
    salt: SnickerdoodleWalletUsernameWithDomain | OperatorDomain, // The salt used to create the proxy address
    beaconAddress: EVMContractAddress,
  ): ResultAsync<
    EVMContractAddress,
    SnickerdoodleFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.computeProxyAddress(
        salt,
        beaconAddress,
      ) as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(e, "Unable to call computeProxyAddress()");
      },
    );
  }

  public computeWalletAddress(
    username: SnickerdoodleWalletUsername,
  ): ResultAsync<
    EVMContractAddress,
    SnickerdoodleFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.computeWalletAddress(
        username,
      ) as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(e, "Unable to call computeWalletAddress()");
      },
    );
  }

  public isSourceChain(): ResultAsync<
    boolean,
    SnickerdoodleFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getIsSourceChain() as Promise<boolean>,
      (e) => {
        return this.generateError(e, "Unable to call getIsSourceChain()");
      },
    );
  }

  public getOperatorDomainName(
    operatorGatewayAddress: EVMContractAddress,
  ): ResultAsync<
    string,
    SnickerdoodleFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getOperatorDomain(
        operatorGatewayAddress,
      ) as Promise<string>,
      (e) => {
        return this.generateError(e, "Unable to call getOperatorDomain()");
      },
    );
  }

  public getWalletHash(
    walletAddress: EVMContractAddress,
  ): ResultAsync<
    string,
    SnickerdoodleFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getWalletHash(walletAddress) as Promise<string>,
      (e) => {
        return this.generateError(e, "Unable to call getWalletHash()");
      },
    );
  }

  public getOperatorHash(
    operatorGatewayAddress: EVMContractAddress,
  ): ResultAsync<
    string,
    SnickerdoodleFactoryContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getOperatorHash(operatorGatewayAddress) as Promise<string>,
      (e) => {
        return this.generateError(e, "Unable to call getOperatorHash()");
      },
    );
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): SnickerdoodleFactoryContractError {
    return new SnickerdoodleFactoryContractError(msg, e, transaction);
  }
}
