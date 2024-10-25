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
      this.contract.factory() as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(e, "Unable to call factory()");
      },
    );
  }

  public operatorAddress(): ResultAsync<
    EVMContractAddress,
    SnickerdoodleWalletContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.operatorAddress() as Promise<EVMContractAddress>,
      (e) => {
        return this.generateError(e, "Unable to call operatorAddress()");
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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

  public generateXWithP256challenge(): Result<string, InvalidParametersError> {
    return ok("");
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): SnickerdoodleWalletContractError {
    return new SnickerdoodleWalletContractError(msg, e, transaction);
  }
}
