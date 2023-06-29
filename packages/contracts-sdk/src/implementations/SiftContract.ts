import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { WrappedTransactionResponse } from "@contracts-sdk/interfaces/index.js";
import { ISiftContract } from "@contracts-sdk/interfaces/ISiftContract.js";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";
import {
  EVMContractAddress,
  TokenUri,
  SiftContractError,
  IBlockchainError,
  BaseURI,
  DomainName,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class SiftContract
  extends BaseContract<SiftContractError>
  implements ISiftContract
{
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    protected contractAddress: EVMContractAddress,
  ) {
    super(providerOrSigner, contractAddress, ContractsAbis.ConsentAbi.abi);
  }

  public getContractAddress(): EVMContractAddress {
    return this.contractAddress;
  }

  public checkURL(
    domain: DomainName,
  ): ResultAsync<TokenUri, SiftContractError> {
    // Returns the tokenURI or string
    // eg. 'www.sift.com/VERIFIED', 'www.sift.com/MALICIOUS' or 'NOT VERIFIED'
    return ResultAsync.fromPromise(
      this.contract.checkURL(domain) as Promise<TokenUri>,
      (e) => {
        return new SiftContractError(
          "Unable to call checkURL()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  // Sets a domain as VERIFIED
  public verifyURL(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, SiftContractError> {
    return this.writeToContract("verifyURL", [domain], overrides);
  }

  // Sets a domain as MALICIOUS
  public maliciousURL(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, SiftContractError> {
    return this.writeToContract("maliciousURL", [domain], overrides);
  }

  public setBaseURI(
    baseUri: BaseURI,
    overrides?: ContractOverrides,
  ): ResultAsync<WrappedTransactionResponse, SiftContractError> {
    return this.writeToContract("setBaseURI", [baseUri], overrides);
  }

  protected generateError(
    msg: string,
    reason: string | undefined,
    e: unknown,
  ): SiftContractError {
    return new SiftContractError(msg, reason, e);
  }
}
