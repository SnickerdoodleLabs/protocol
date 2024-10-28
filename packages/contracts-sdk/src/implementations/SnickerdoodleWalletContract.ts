import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  SnickerdoodleWalletContractError,
  WebauthnCredentialId,
  P256PublicKeyComponents,
  P256SignatureComponents,
  InvalidParametersError,
  ClientDataJSONComponents,
  AuthenticatorData,
  P256PublicKeyPointX,
  P256PublicKeyPointY,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ok, Result, ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
  ISnickerdoodleWalletContract,
} from "@contracts-sdk/interfaces/index.js";
import {
  P256VerificationData,
  ContractsAbis,
  P256KeyStruct,
} from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class SnickerdoodleWalletContract
  extends BaseContract<SnickerdoodleWalletContractError>
  implements ISnickerdoodleWalletContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
  ) {
    super(
      providerOrSigner,
      contractAddress,
      ContractsAbis.SnickerdoodleWalletAbi.abi,
    );
  }

  public factoryAddress(): ResultAsync<
    EVMContractAddress,
    SnickerdoodleWalletContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getFactory() as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(e, "Unable to call getFactory()");
      },
    );
  }

  public operatorAddress(): ResultAsync<
    EVMContractAddress,
    SnickerdoodleWalletContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getOperator() as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(e, "Unable to call getOperator()");
      },
    );
  }

  public addP256KeyWithP256Key(
    keyId: WebauthnCredentialId,
    authenticatorData: AuthenticatorData,
    clientDataJSON: ClientDataJSONComponents,
    newP256Key: P256PublicKeyComponents,
    p256Signature: P256SignatureComponents,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  > {
    return this.writeToContract(
      "addP256KeyWithP256Key",
      [
        keyId,
        new P256VerificationData(
          authenticatorData,
          clientDataJSON.clientDataJSONLeft,
          clientDataJSON.clientDataJSONRight,
        ),
        newP256Key,
        p256Signature,
      ],
      overrides,
    );
  }

  public generateAddP256KeyWithP256KeyChallenge(
    newKeyId: WebauthnCredentialId,
    newP256PublicKey: P256PublicKeyComponents,
  ): Result<string, InvalidParametersError> {
    return ok(newKeyId + newP256PublicKey.x + newP256PublicKey.y);
  }

  public addEVMAddressWithP256Key(
    keyId: WebauthnCredentialId,
    authenticatorData: AuthenticatorData,
    clientDataJSON: ClientDataJSONComponents,
    evmAccount: EVMAccountAddress | EVMContractAddress,
    p256Signature: P256SignatureComponents,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  > {
    return this.writeToContract(
      "addEVMAddressWithP256Key",
      [
        keyId,
        new P256VerificationData(
          authenticatorData,
          clientDataJSON.clientDataJSONLeft,
          clientDataJSON.clientDataJSONRight,
        ),
        evmAccount,
        p256Signature,
      ],
      overrides,
    );
  }

  public generateAddEVMAddressWithP256KeyChallenge(
    evmAccountAddress: EVMAccountAddress,
  ): Result<string, InvalidParametersError> {
    return ok(evmAccountAddress);
  }

  public addEVMAccountWithEVMAccount(
    evmAccount: EVMAccountAddress | EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  > {
    return this.writeToContract(
      "addEVMAccountWithEVMAccount",
      [evmAccount],
      overrides,
    );
  }

  public removeEVMAccountWithEVMAccount(
    evmAccount: EVMAccountAddress | EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  > {
    return this.writeToContract(
      "removeEVMAccountWithEVMAccount",
      [evmAccount],
      overrides,
    );
  }

  public withdrawLocalERC20Asset(
    tokenAddress: EVMContractAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  > {
    return this.writeToContract(
      "withdrawLocalERC20Asset",
      [tokenAddress],
      overrides,
    );
  }

  public withdrawNativeAsset(
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  > {
    return this.writeToContract("withdrawNativeAsset", [], overrides);
  }

  public name(): ResultAsync<
    string,
    SnickerdoodleWalletContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getName() as Promise<string>,
      (e) => {
        return this.generateError(e, "Unable to call getName()");
      },
    );
  }

  public p256KeyHashes(): ResultAsync<
    string[],
    SnickerdoodleWalletContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getP256KeyHashes() as Promise<string[]>,
      (e) => {
        return this.generateError(e, "Unable to call getP256KeyHashes()");
      },
    );
  }

  public p256Key(keyHash: string): ResultAsync<
    {
      keyId: WebauthnCredentialId;
      p256PublicKeyComponents: P256PublicKeyComponents;
    },
    SnickerdoodleWalletContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getP256Key(keyHash) as Promise<P256KeyStruct>,
      (e) => {
        return this.generateError(e, "Unable to call getP256KeyHashes()");
      },
    ).map((p256Struct) => {
      return {
        keyId: WebauthnCredentialId(p256Struct.keyId),
        p256PublicKeyComponents: new P256PublicKeyComponents(
          P256PublicKeyPointX(p256Struct.x),
          P256PublicKeyPointY(p256Struct.y),
        ),
      };
    });
  }

  public evmAccounts(): ResultAsync<
    EVMAccountAddress[],
    SnickerdoodleWalletContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getEvmAccounts() as Promise<EVMAccountAddress[]>,
      (e) => {
        return this.generateError(e, "Unable to call evmAccounts()");
      },
    );
  }

  public evmAccountIndex(
    address: EVMAccountAddress | EVMContractAddress,
  ): ResultAsync<
    number,
    SnickerdoodleWalletContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getEvmAccountIndex(address) as Promise<number>,
      (e) => {
        return this.generateError(e, "Unable to call getEvmAccountIndex()");
      },
    );
  }

  public hashUsed(
    hash: string,
  ): ResultAsync<
    boolean,
    SnickerdoodleWalletContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.hashUsed(hash) as Promise<boolean>,
      (e) => {
        return this.generateError(e, "Unable to call hashUsed()");
      },
    );
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): SnickerdoodleWalletContractError {
    return new SnickerdoodleWalletContractError(msg, e, transaction);
  }
}
