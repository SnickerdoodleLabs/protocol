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
import { err, ok, Result, ResultAsync } from "neverthrow";

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

  public static generateAddP256KeyWithP256KeyChallenge(
    newKeyId: WebauthnCredentialId,
    newP256PublicKey: P256PublicKeyComponents,
  ): Result<Uint8Array, InvalidParametersError> {
    // Convert keyid to Uint8Array (UTF-8 encoding)
    const uint8keyId = new TextEncoder().encode(newKeyId);

    // Convert qx and qy from hex string to Uint8Array
    const uint8qx = new Uint8Array(
      newP256PublicKey.x
        .slice(2)
        .match(/.{1,2}/g)
        ?.map((byte) => parseInt(byte, 16)) ?? [],
    );
    const uint8qy = new Uint8Array(
      newP256PublicKey.y
        .slice(2)
        .match(/.{1,2}/g)
        ?.map((byte) => parseInt(byte, 16)) ?? [],
    );

    if (uint8qx.length == 0 || uint8qy.length == 0) {
      return err(new InvalidParametersError("Invalid P256PublicKeyComponents"));
    }

    // Combine all Uint8Arrays into a single Uint8Array
    const totalLength = uint8keyId.length + uint8qx.length + uint8qy.length;
    const payload = new Uint8Array(totalLength);

    payload.set(uint8keyId, 0);
    payload.set(uint8qx, uint8keyId.length);
    payload.set(uint8qy, uint8keyId.length + uint8qx.length);

    return ok(payload);
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
  public static generateAddEVMAddressWithP256KeyChallenge(
    evmAccountAddress: EVMAccountAddress,
  ): Result<Uint8Array, InvalidParametersError> {
    // Ensure the address starts with "0x" before slicing it off
    const normalizedAddress = evmAccountAddress.startsWith("0x")
      ? evmAccountAddress.slice(2)
      : evmAccountAddress;

    // Convert address to Uint8Array
    return ok(new TextEncoder().encode(normalizedAddress));
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
