import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import {
  BlockchainCommonErrors,
  DomainName,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import {
  ContractOverrides,
  IERC7529Contract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

export abstract class ERC7529Contract<T>
  extends BaseContract<T>
  implements IERC7529Contract<T>
{
  constructor(
    protected providerOrSigner: ethers.providers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
    protected abi: ethers.ContractInterface = {},
  ) {
    // We'll merge the ERC7529 ABI with the provided ABI
    const mergedABI = ObjectUtils.mergeDeep<ethers.ContractInterface>(
      abi,
      ContractsAbis.ERC7529Abi,
    );
    super(providerOrSigner, contractAddress, mergedABI);
  }

  public addDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T> {
    return this.writeToContract("addDomain", [domain], overrides);
  }

  public removeDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, BlockchainCommonErrors | T> {
    return this.writeToContract("removeDomain", [domain], overrides);
  }

  public getDomains(): ResultAsync<DomainName[], BlockchainCommonErrors | T> {
    return ResultAsync.fromPromise(
      // returns array of domains
      this.contract.getDomains() as Promise<DomainName[]>,
      (e) => {
        return this.generateError(e, "Unable to call getDomains()");
      },
    );
  }
}
