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

import { ISiftContract } from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi/index.js";

@injectable()
export class SiftContract implements ISiftContract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    protected contractAddress: EVMContractAddress,
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      ContractsAbis.SiftAbi.abi,
      providerOrSigner,
    );
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

  public verifyURL(domain: DomainName): ResultAsync<void, SiftContractError> {
    return ResultAsync.fromPromise(
      this.contract.verifyURL(
        domain,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        // No error handling needed, any reverts from function call should return the reason
        return new SiftContractError(
          "Unable to call verifyURL()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new SiftContractError(
            "Wait for verifyURL() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public maliciousURL(
    domain: DomainName,
  ): ResultAsync<void, SiftContractError> {
    return ResultAsync.fromPromise(
      this.contract.maliciousURL(
        domain,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        // No error handling needed, any reverts from function call should return the reason
        return new SiftContractError(
          "Unable to call maliciousURL()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new SiftContractError(
            "Wait for maliciousURL() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public setBaseURI(baseUri: BaseURI): ResultAsync<void, SiftContractError> {
    return ResultAsync.fromPromise(
      this.contract.setBaseURI(
        baseUri,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new SiftContractError(
          "Unable to call setBaseURI()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new SiftContractError(
            "Wait for setBaseURI() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public getContract(): ethers.Contract {
    return this.contract;
  }
}
