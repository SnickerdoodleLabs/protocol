import {
  EVMAccountAddress,
  EVMContractAddress,
  MinimalForwarderContractError,
  BigNumberString,
  Signature,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper";
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
    protected providerOrSigner: ethers.Provider | ethers.Signer,
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
      this.contract.getNonce(from) as Promise<bigint>,
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
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): MinimalForwarderContractError {
    return new MinimalForwarderContractError(msg, e, transaction);
  }
}
