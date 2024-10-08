import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  SnickerdoodleWalletContractError,
  PasskeyId,
  HexString32,
  PasskeyPublicKeyPointX,
  PasskeyPublicKeyPointY,
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

  public isOperator(
    address: EVMAccountAddress | EVMContractAddress,
  ): ResultAsync<
    boolean,
    SnickerdoodleWalletContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.operators(address) as Promise<boolean>,
      (e) => {
        return this.generateError(e, "Unable to call operators()");
      },
    );
  }

  public addP256KeyWithP256Key(
    keyId: PasskeyId,
    authenticatorData: AuthenticatorData,
    newKeyId: PasskeyId,
    x: PasskeyPublicKeyPointX,
    y: PasskeyPublicKeyPointY,
    r: HexString32,
    s: HexString32,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  > {
    return this.writeToContract(
      "addP256KeyWithP256Key",
      [keyId, authenticatorData, newKeyId, x, y, r, s],
      overrides,
    );
  }

  public addEVMAddressWithP256Key(
    keyId: PasskeyId,
    authenticatorData: AuthenticatorData,
    evmAccount: EVMAccountAddress | EVMContractAddress,
    r: HexString32,
    s: HexString32,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  > {
    return this.writeToContract(
      "addEMVAddressWithP256Key",
      [keyId, authenticatorData, evmAccount, r, s],
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
