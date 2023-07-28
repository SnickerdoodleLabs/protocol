import {
  EVMAccountAddress,
  EVMContractAddress,
  MinimalForwarderContractError,
  BigNumberString,
  Signature,
  BlockchainCommonErrors,
  BlockchainErrorMapper,
} from "@snickerdoodlelabs/objects";
import { BigNumber, ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import {
  ContractOverrides,
  IMinimalForwarderContract,
  IMinimalForwarderRequest,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

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
    MinimalForwarderContractError | BlockchainCommonErrors
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
    MinimalForwarderContractError | BlockchainCommonErrors
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
    BlockchainCommonErrors | MinimalForwarderContractError
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
}
