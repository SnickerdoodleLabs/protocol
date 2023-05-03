import { WrappedTransactionResponseBuilder } from "@contracts-sdk/implementations/WrappedTransactionResponseBuilder";
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
    return this.writeToContract("verifyURL", [domain]);
  }

  public maliciousURL(
    domain: DomainName,
  ): ResultAsync<WrappedTransactionResponse, SiftContractError> {
    return this.writeToContract("maliciousURL", [domain]);
  }

  public setBaseURI(
    baseUri: BaseURI,
  ): ResultAsync<WrappedTransactionResponse, SiftContractError> {
    return this.writeToContract("setBaseURI", [baseUri]);
  }

  public getContract(): ethers.Contract {
    return this.contract;
  }

  // Takes the Sift contract's function name and params, submits the transaction and returns a WrappedTransactionResponse
  protected writeToContract(
    functionName: string,
    functionParams: any[],
  ): ResultAsync<WrappedTransactionResponse, SiftContractError> {
    return ResultAsync.fromPromise(
      this.contract[functionName](
        ...functionParams,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new SiftContractError(
          `Unable to call ${functionName}()`,
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((tx) => {
      return this.toWrappedTransactionResponse(
        tx,
        functionName,
        functionParams,
      );
    });
  }

  protected toWrappedTransactionResponse(
    transactionResponse: ethers.providers.TransactionResponse,
    functionName: string,
    functionParams: any[],
  ): WrappedTransactionResponse {
    return WrappedTransactionResponseBuilder.buildWrappedTransactionResponse(
      transactionResponse,
      EVMContractAddress(this.contract.address),
      EVMAccountAddress((this.providerOrSigner as ethers.Wallet)?.address),
      functionName,
      functionParams,
      ContractsAbis.ConsentFactoryAbi.abi,
    );
  }
}
