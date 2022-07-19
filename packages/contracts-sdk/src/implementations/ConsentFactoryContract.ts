import { IConsentFactoryContract } from "@contracts-sdk/interfaces/IConsentFactoryContract";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/abi";
import { ConsentRoles } from "@contracts-sdk/interfaces/objects/ConsentRoles";
import { ContractOverrides } from "@contracts-sdk/interfaces/objects/ContractOverrides";
import {
  ConsentFactoryContractError,
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
  IBlockchainError,
} from "@snickerdoodlelabs/objects";
import { ethers, BigNumber } from "ethers";
import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
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
      ContractsAbis.ConsentFactoryAbi.abi,
      providerOrSigner,
    );
  }

  // Function to help user create consent
  // After creating consent, call getUserDeployedConsentsCount to get total number of deployed consents
  // Then use getUserConsentAddressesByIndex to get list of count
  public createConsent(
    ownerAddress: EVMAccountAddress,
    baseUri: string,
    overrides?: ContractOverrides,
  ): ResultAsync<void, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.createConsent(
        ownerAddress,
        baseUri,
        overrides,
      ) as Promise<ethers.providers.TransactionResponse>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call createConsent()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    )
      .andThen((tx) => {
        return ResultAsync.fromPromise(tx.wait(), (e) => {
          return new ConsentFactoryContractError(
            "Wait for optIn() failed",
            "Unknown",
            e,
          );
        });
      })
      .map(() => {});
  }

  // Gets the count of user's deployed Consents
  public getUserDeployedConsentsCount(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<number, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getUserDeployedConsentsCount(
        ownerAddress,
      ) as Promise<BigNumber>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getUserDeployedConsentsCount()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((count) => {
      return count.toNumber();
    });
  }

  // Gets the array of user deployed Consents by index count
  // Index values can be anywhere between the count obtained from getUserDeployedConsentsCount
  // eg. If user has [0x123, 0xabc, 0x456] Consent contracts, query with startingIndex 0 and endingIndex 2 to get full list
  public getUserDeployedConsentsByIndex(
    ownerAddress: EVMAccountAddress,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getUserDeployedConsentsByIndex(
        ownerAddress,
        startingIndex,
        endingIndex,
      ) as Promise<EVMContractAddress[]>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getUserDeployedConsentsByIndex()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  // Gets the count of Consent address user has opted into
  public getUserConsentAddressesCount(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<number, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getUserConsentAddressesCount(
        ownerAddress,
      ) as Promise<BigNumber>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getUserConsentAddressesCount()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((count) => {
      return count.toNumber();
    });
  }

  // Gets the array of Consent addresses user has opted into
  // Index values can be anywhere between the count obtained from getUserConsentAddressesCount
  // eg. If user has [0x123, 0xabc, 0x456] Consent contracts, query with startingIndex 0 and endingIndex 2 to get full list
  public getUserConsentAddressesByIndex(
    ownerAddress: EVMAccountAddress,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getUserConsentAddressesByIndex(
        ownerAddress,
        startingIndex,
        endingIndex,
      ) as Promise<EVMContractAddress[]>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getUserConsentAddressesByIndex()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }

  // Gets the count of Consent addresses user has specific roles for
  public getUserRoleAddressesCount(
    ownerAddress: EVMAccountAddress,
    role: ConsentRoles,
  ): ResultAsync<number, ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getUserConsentAddressesCount(
        ownerAddress,
        role,
      ) as Promise<BigNumber>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call getUserRoleAddressesCount()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    ).map((count) => {
      return count.toNumber();
    });
  }

  // Gets the array of Consent addresses user has specific roles for
  // Index values can be anywhere between the count obtained from getUserRoleAddressesCount
  // eg. If user has [0x123, 0xabc, 0x456] Consent contracts, query with startingIndex 0 and endingIndex 2 to get full list
  public getUserRoleAddressesCountByIndex(
    ownerAddress: EVMAccountAddress,
    role: ConsentRoles,
    startingIndex: number,
    endingIndex: number,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.getUserRoleAddressesCountByIndex(
        ownerAddress,
        role,
        startingIndex,
        endingIndex,
      ) as Promise<EVMContractAddress[]>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call filters.getUserRoleAddressesCountByIndex()",
          (e as IBlockchainError).reason,
          e,
        );
      },
    );
  }
}
// Alternative option is to get the deployed Consent addresses through filtering event ConsentDeployed() event

/* // TODO: Replace Promise<any> with correct types returned from ConsentDeployed() and queryFilter()
  public getConsentsDeployedByOwner(
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<EVMContractAddress[], ConsentFactoryContractError> {
    return ResultAsync.fromPromise(
      this.contract.filters.ConsentDeployed(ownerAddress) as Promise<any>,
      (e) => {
        return new ConsentFactoryContractError(
          "Unable to call filters.ConsentDeployed()",
          (e as IBlockchainError).reason,
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
              (e as IBlockchainError).reason,
              e,
            );
          },
        );
      })
      .map((logs) => {
        return logs.map((log) => log.args.consentAddress);
      });
  }
} */
