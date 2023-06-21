import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import {
  ContractOverrides,
  IMinimalForwarderContract,
  IMinimalForwarderRequest,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import {
  EVMAccountAddress,
  EVMContractAddress,
  MinimalForwarderContractError,
  IBlockchainError,
  BigNumberString,
  Signature,
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
  ): ResultAsync<BigNumberString, MinimalForwarderContractError> {
    return ResultAsync.fromPromise(
      this.contract.getNonce(from) as Promise<BigNumber>,
      (e) => {
        return new MinimalForwarderContractError(
          `Unable to call getNonce(${from})`,
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((nonce) => {
      return BigNumberString(nonce.toString());
    });
  }

  public verify(
    request: IMinimalForwarderRequest,
    signature: Signature,
  ): ResultAsync<boolean, MinimalForwarderContractError> {
    return ResultAsync.fromPromise(
      this.contract.verify(request, signature) as Promise<boolean>,
      (e) => {
        return new MinimalForwarderContractError(
          `Unable to call verify()`,
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public execute(
    request: IMinimalForwarderRequest,
    signature: Signature,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, MinimalForwarderContractError> {
    return this.writeToContract("execute", [request, signature], overrides);
  }

  public getContract(): ethers.Contract {
    return this.contract;
  }

  protected generateError(
    msg: string,
    reason: string | undefined,
    e: unknown,
  ): MinimalForwarderContractError {
    return new MinimalForwarderContractError(msg, reason, e);
  }
}
