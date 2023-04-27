import { ISiftContract } from "@contracts-sdk/interfaces/ISiftContract";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";
import {
  EVMAccountAddress,
  EVMContractAddress,
  TokenUri,
  TokenId,
  SiftContractError,
  IBlockchainError,
  HexString,
  BaseURI,
  DomainName,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ok, err, okAsync, ResultAsync } from "neverthrow";
import { EdgeInsetsPropType } from "react-native";

import { WrappedTransactionResponse } from "..";

@injectable()
export class SiftContract implements ISiftContract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    public contractAddress: EVMContractAddress,
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      ContractsAbis.SiftAbi.abi,
      providerOrSigner,
    );
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

  public verifyURL(
    domain: DomainName,
  ): ResultAsync<WrappedTransactionResponse, SiftContractError> {
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
    ).map((tx) => {
      return new WrappedTransactionResponse(tx);
    });
  }

  public maliciousURL(
    domain: DomainName,
  ): ResultAsync<WrappedTransactionResponse, SiftContractError> {
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
    ).map((tx) => {
      return new WrappedTransactionResponse(tx);
    });
  }

  public setBaseURI(
    baseUri: BaseURI,
  ): ResultAsync<WrappedTransactionResponse, SiftContractError> {
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
    ).map((tx) => {
      return new WrappedTransactionResponse(tx);
    });
  }

  public getContract(): ethers.Contract {
    return this.contract;
  }
}
