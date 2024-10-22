import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  SnickerdoodleWalletContractError,
  PasskeyId,
  P256PublicKeyComponent,
  P256SignatureComponent,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
  ISnickerdoodleWalletContract,
} from "@contracts-sdk/interfaces/index.js";
import {
  AuthenticatorData,
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
    keyId: PasskeyId,
    authenticatorData: AuthenticatorData,
    newP256Key: P256PublicKeyComponent,
    p256Signature: P256SignatureComponent,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  > {
    return this.writeToContract(
      "addP256KeyWithP256Key",
      [keyId, authenticatorData, newP256Key, p256Signature],
      overrides,
    );
  }

  public addEVMAddressWithP256Key(
    keyId: PasskeyId,
    authenticatorData: AuthenticatorData,
    evmAccount: EVMAccountAddress | EVMContractAddress,
    p256Signature: P256SignatureComponent,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  > {
    return this.writeToContract(
      "addEMVAddressWithP256Key",
      [keyId, authenticatorData, evmAccount, p256Signature],
      overrides,
    );
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

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): SnickerdoodleWalletContractError {
    return new SnickerdoodleWalletContractError(msg, e, transaction);
  }
}
