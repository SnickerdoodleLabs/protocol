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

import {
  IMinimalForwarderContract,
  IMinimalForwarderRequest,
} from "@contracts-sdk/interfaces";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";

@injectable()
export class MinimalForwarderContract implements IMinimalForwarderContract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    contractAddress: EVMContractAddress,
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      ContractsAbis.MinimalForwarderAbi.abi,
      providerOrSigner,
    );
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
  ): ResultAsync<
    ethers.providers.TransactionResponse,
    MinimalForwarderContractError
  > {
    return ResultAsync.fromPromise(
      this.contract.execute(
        request,
        signature,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new MinimalForwarderContractError(
          `Unable to call execute()`,
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public getContract(): ethers.Contract {
    return this.contract;
  }
}
