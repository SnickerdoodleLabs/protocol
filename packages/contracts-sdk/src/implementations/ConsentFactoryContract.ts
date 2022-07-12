import {
  ConsentFactoryContractError,
  ConsentName,
  EVMAccountAddress,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IConsentFactoryContract } from "@contracts-sdk/interfaces/IConsentFactoryContract";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";

@injectable()
export class ConsentFactoryContract implements IConsentFactoryContract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    consentFactoryAddress: EVMContractAddress,
  ) {
    this.contract = new ethers.Contract(
      consentFactoryAddress,
      ContractsAbis.CrumbsAbi.abi,
      providerOrSigner,
    );
  }

  public createConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: string,
    consentName: ConsentName,
    overrides?: ContractOverrides,
  ): ResultAsync<EVMContractAddress, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.createConsent(
        ownerAddress,
        baseUri,
        consentName,
        overrides,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call createConsent()",
          e,
        );
      },
    ).andThen(() => {
      return this.getConsentBPAddress(ownerAddress);
    });
  }

  private getConsentBPAddress(
    owneraddress: EVMAccountAddress,
  ): ResultAsync<EVMContractAddress, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getConsentBP(owneraddress) as Promise<EVMContractAddress>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getConsentBP()",
          e,
        );
      },
    );
  }

  // TODO: Replace Promise<any> with correct types returned from ConsentDeployed() and queryFilter()
  public getConsentsDeployedByOwner(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.filters.ConsentDeployed(ownerAddress) as Promise<any>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call filters.ConsentDeployed()",
          e,
        );
      },
    )
      .andThen((_logs) => {
        return ResultAsync.fromPromise(
          this.contract.queryFilter(_logs) as Promise<any>,
          (e) => {
            return new ConsentFactoryContractError(
              "Unable to call filters.ConsentDeployed()",
              e,
            );
          },
        );
      })
      .map((logs) => {
        return logs.map((log) => log.args.consentAddress);
      });
  }
}
