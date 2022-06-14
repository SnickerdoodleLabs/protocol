import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";
import {
  ConsentFactoryContractError,
  ConsentName,
  EthereumAccountAddress,
  EthereumContractAddress,
} from "@snickerdoodlelabs/objects";

import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";
import { IConsentFactoryContract } from "@contracts-sdk/interfaces/IConsentFactoryContract";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";

export class ConsentFactoryContract implements IConsentFactoryContract {
  protected contract: ethers.Contract;
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    consentFactoryAddress: EthereumContractAddress,
  ) {
    this.contract = new ethers.Contract(
      consentFactoryAddress,
      ContractsAbis.ConsentFactoryAbi.abi,
      providerOrSigner,
    );
  }

  public createConsent(
    ownerAddress: EthereumAccountAddress,
    baseUri: string,
    consentName: ConsentName,
    overrides?: ContractOverrides,
  ): ResultAsync<EthereumContractAddress, ConsentFactoryContractError> {
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
    owneraddress: EthereumAccountAddress,
  ): ResultAsync<EthereumContractAddress, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getConsentBP(
        owneraddress,
      ) as Promise<EthereumContractAddress>,
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
    ownerAddress: EthereumAccountAddress,
  ): ResultAsync<EthereumContractAddress[], ConsentFactoryContractError> {
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
