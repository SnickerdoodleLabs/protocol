import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import {
  ContractOverrides,
  IMinimalForwarderContract,
  IMinimalForwarderRequest,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";
import {
  EVMAccountAddress,
  EVMContractAddress,
  MinimalForwarderContractError,
  BigNumberString,
  Signature,
  TBlockchainCommonErrors,
  BlockchainErrorMapper,
} from "@snickerdoodlelabs/objects";
import { BigNumber, ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class MinimalForwarderContract
  extends BaseContract<MinimalForwarderContractError>
  implements IMinimalForwarderContract
{
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    protected contractAddress: EVMContractAddress,
  ) {
    super(
      providerOrSigner,
      contractAddress,
      ContractsAbis.MinimalForwarderAbi.abi,
    );
  }

  public getContractAddress(): EVMContractAddress {
    return this.contractAddress;
  }

  public getNonce(
    from: EVMAccountAddress,
  ): ResultAsync<
    BigNumberString,
    MinimalForwarderContractError | TBlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getNonce(from) as Promise<BigNumber>,
      (e) => {
        return this.generateError(e, `Unable to call getNonce(${from})`);
      },
    ).map((nonce) => {
      return BigNumberString(nonce.toString());
    });
  }

  public verify(
    request: IMinimalForwarderRequest,
    signature: Signature,
  ): ResultAsync<
    boolean,
    MinimalForwarderContractError | TBlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.verify(request, signature) as Promise<boolean>,
      (e) => {
        return this.generateError(e, `Unable to call verify()`);
      },
    );
  }

  public execute(
    request: IMinimalForwarderRequest,
    signature: Signature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    TBlockchainCommonErrors | MinimalForwarderContractError
  > {
    return this.writeToContract("execute", [request, signature], overrides);
  }

  protected generateContractSpecificError(
    msg: string,
    reason: string | undefined,
    e: unknown,
  ): MinimalForwarderContractError {
    return new MinimalForwarderContractError(msg, reason, e);
  }

  protected generateError(
    error,
    errorMessage: string,
  ): MinimalForwarderContractError | TBlockchainCommonErrors {
    return BlockchainErrorMapper.buildBlockchainError(
      error,
      (msg, reason, err) =>
        this.generateContractSpecificError(errorMessage || msg, reason, err),
    );
  }
}
