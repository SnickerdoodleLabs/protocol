import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  OperatorGatewayContractError,
  PasskeyId,
  P256PublicKeyComponent,
  P256SignatureComponent,
  LayerZeroEndpointId,
  OperatorDomain,
  TokenAmount,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { ERC7529Contract } from "@contracts-sdk/implementations/ERC7529Contract.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
  IOperatorGatewayContract,
} from "@contracts-sdk/interfaces/index.js";
import {
  AuthenticatorData,
  ContractsAbis,
} from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class OperatorGatewayContract
  extends ERC7529Contract<OperatorGatewayContractError>
  implements IOperatorGatewayContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
  ) {
    super(
      providerOrSigner,
      contractAddress,
      ContractsAbis.OperatorGatewayAbi.abi,
    );
  }

  public deployWallets(
    usernames: string[],
    p256Keys: P256PublicKeyComponent[][],
    evmAccounts: EVMContractAddress[][] | EVMAccountAddress[][],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    OperatorGatewayContractError | BlockchainCommonErrors
  > {
    return this.writeToContract(
      "deployWallets",
      [usernames, p256Keys, evmAccounts],
      overrides,
    );
  }

  public reserveWalletsOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    usernames: string[],
    gas: bigint,
    nativeTokenFee: bigint, // Required fee calculated from the quote function to be sent with the transaction to pay for the LayerZero _lzReceive() call
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OperatorGatewayContractError
  > {
    // If there are no overrides provided, create an empty object
    const overridesWithFee = overrides ? overrides : ({} as ContractOverrides);

    // include the fee in the overrides object
    overridesWithFee.value = nativeTokenFee;

    return this.writeToContract(
      "reserveWalletsOnDestinationChain",
      [destinationLayerZeroEndpointId, usernames, gas],
      overrides,
    );
  }

  public quoteAuthorizeOperatorGatewayOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    domain: OperatorDomain,
    gas: bigint,
  ): ResultAsync<
    TokenAmount,
    OperatorGatewayContractError | BlockchainCommonErrors
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

  public authorizeWalletOnDestinationChain(
    destinationLayerZeroEndpointId: LayerZeroEndpointId,
    username: string,
    gas: bigint,
    nativeTokenFee: bigint, // Required fee calculated from the quoteAuthorizeWalletOnDestinationChain function to be sent with the transaction to pay for the LayerZero _lzReceive() call
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OperatorGatewayContractError
  > {
    // If there are no overrides provided, create an empty object
    const overridesWithFee = overrides ? overrides : ({} as ContractOverrides);

    // include the fee in the overrides object
    overridesWithFee.value = nativeTokenFee;

    return this.writeToContract(
      "authorizeWalletOnDestinationChain",
      [destinationLayerZeroEndpointId, username, gas],
      overrides,
    );
  }

  public addP256KeysWithP256Keys(
    evmAccounts: EVMContractAddress[] | EVMAccountAddress[],
    keyIds: PasskeyId[],
    authenticatorDatas: AuthenticatorData[],
    newP256Keys: P256PublicKeyComponent[],
    p256Signatures: P256SignatureComponent[],
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OperatorGatewayContractError
  > {
    return this.writeToContract(
      "addP256KeyWithP256Key",
      [evmAccounts, keyIds, authenticatorDatas, newP256Keys, p256Signatures],
      overrides,
    );
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): OperatorGatewayContractError {
    return new OperatorGatewayContractError(msg, e, transaction);
  }
}
