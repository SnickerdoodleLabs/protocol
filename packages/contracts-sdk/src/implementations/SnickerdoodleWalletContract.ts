import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  SnickerdoodleWalletContractError,
  TokenAmount,
  TokenId,
  PasskeyId,
  JSONString,
  HexString32,
} from "@snickerdoodlelabs/objects";
import { BytesLike, ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
  ISnickerdoodleWalletContract,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

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
    authenticatorData: BytesLike,
    clientDataJSONLeft: JSONString,
    newKeyId: PasskeyId,
    qx: HexString32,
    qy: HexString32,
    clientDataJSONRight: JSONString,
    r: HexString32,
    s: HexString32,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  > {
    return this.writeToContract(
      "addP256KeyWithP256Key",
      [
        keyId,
        authenticatorData,
        clientDataJSONLeft,
        newKeyId,
        qx,
        qy,
        clientDataJSONRight,
        r,
        s,
      ],
      overrides,
    );
  }

  public addEMVAddressWithP256Key(
    keyId: PasskeyId,
    authenticatorData: BytesLike,
    clientDataJSONLeft: JSONString,
    evmAccount: EVMAccountAddress | EVMContractAddress,
    clientDataJSONRight: JSONString,
    r: HexString32,
    s: HexString32,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SnickerdoodleWalletContractError
  > {
    return this.writeToContract(
      "addEMVAddressWithP256Key",
      [
        keyId,
        authenticatorData,
        clientDataJSONLeft,
        evmAccount,
        clientDataJSONRight,
        r,
        s,
      ],
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

  public filters = {
    Transfer: (
      fromAddress: EVMAccountAddress | null,
      toAddress: EVMAccountAddress | null,
    ): ethers.DeferredTopicFilter => {
      return this.contract.filters.Transfer(fromAddress, toAddress);
    },
  };
}
