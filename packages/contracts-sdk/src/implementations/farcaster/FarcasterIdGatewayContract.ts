import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  FarcasterIdGatewayContractError,
  Signature,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import {
  ContractOverrides,
  IFarcasterIdGatewayContract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class FarcasterIdGatewayContract
  extends BaseContract<FarcasterIdGatewayContractError>
  implements IFarcasterIdGatewayContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
  ) {
    super(
      providerOrSigner,
      contractAddress,
      ContractsAbis.FarcasterIdGatewayAbi.abi,
    );
  }

  public price(): ResultAsync<
    bigint,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.price() as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call price()");
      },
    );
  }

  public priceWithExtraStorage(
    extraStorage: bigint,
  ): ResultAsync<
    bigint,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.price(extraStorage) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call price()");
      },
    );
  }

  public register(
    recoveryAddress: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | FarcasterIdGatewayContractError
  > {
    return this.writeToContract("register", [recoveryAddress], overrides);
  }

  public registerWithExtraStorage(
    recoveryAddress: EVMAccountAddress,
    extraStorage: bigint,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | FarcasterIdGatewayContractError
  > {
    return this.writeToContract(
      "register",
      [recoveryAddress, extraStorage],
      overrides,
    );
  }

  public registerFor(
    ownerAddress: EVMAccountAddress,
    recoveryAddress: EVMAccountAddress,
    deadline: UnixTimestamp,
    signature: Signature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  > {
    return this.writeToContract(
      "registerFor",
      [ownerAddress, recoveryAddress, deadline, signature],
      overrides,
    );
  }

  public registerForWithExtraStorage(
    ownerAddress: EVMAccountAddress,
    recoveryAddress: EVMAccountAddress,
    deadline: UnixTimestamp,
    signature: Signature,
    extraStorage: bigint,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  > {
    return this.writeToContract(
      "registerFor",
      [ownerAddress, recoveryAddress, deadline, signature, extraStorage],
      overrides,
    );
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): FarcasterIdGatewayContractError {
    return new FarcasterIdGatewayContractError(msg, e, transaction);
  }
}
