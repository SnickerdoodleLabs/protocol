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
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
    abi?: ethers.InterfaceAbi,
  ) {
    // If you provide your own ABI, we'll use that, but we have a built-in default ERC7529 ABI
    if (abi == undefined) {
      abi = ContractsAbis.ERC7529Abi.abi;
    }
    super(providerOrSigner, contractAddress, abi);
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

  public getDomain(
    domain: DomainName,
  ): ResultAsync<boolean, BlockchainCommonErrors | T> {
    return ResultAsync.fromPromise(
      // returns array of domains
      this.contract.getDomain(domain) as Promise<boolean>,
      (e) => {
        return this.generateError(e, "Unable to call getDomain()");
      },
    );
  }
}
