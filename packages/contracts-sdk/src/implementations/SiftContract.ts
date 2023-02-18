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
  SiftEntity,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ok, err, okAsync, ResultAsync } from "neverthrow";
import { EdgeInsetsPropType } from "react-native";

import { ISiftContract } from "@contracts-sdk/interfaces/ISiftContract";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";

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
    console.log("this.contract: ", this.contract);
    console.log("contractAddress: ", contractAddress);
    console.log("ContractsAbis.SiftAbi.abi: ", ContractsAbis.SiftAbi.abi);
    console.log("providerOrSigner: ", providerOrSigner);
  }

  public checkEntity(
    domain: DomainName,
  ): ResultAsync<SiftEntity, SiftContractError> {
    // Returns the tokenURI or string
    // eg. 'www.sift.com/VERIFIED', 'www.sift.com/MALICIOUS' or 'NOT VERIFIED'
    return ResultAsync.fromPromise(
      this.contract.checkEntity(domain) as Promise<SiftEntity>,
      (e) => {
        return new SiftContractError(
          "Unable to call checkEntity()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  public verifyEntity(domain: DomainName): ResultAsync<void, SiftContractError> {
    return ResultAsync.fromPromise(
      this.contract.verifyEntity(
        domain,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        // No error handling needed, any reverts from function call should return the reason
        return new SiftContractError(
          "Unable to call verifyEntity()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new SiftContractError(
            "Wait for verifyEntity() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  public maliciousEntity(
    domain: DomainName,
  ): ResultAsync<void, SiftContractError> {
    return ResultAsync.fromPromise(
      this.contract.maliciousEntity(
        domain,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        // No error handling needed, any reverts from function call should return the reason
        return new SiftContractError(
          "Unable to call maliciousEntity()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new SiftContractError(
            "Wait for maliciousEntity() failed",
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
