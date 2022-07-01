import {
  ClickData,
  ClickFilter,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  EVMTransaction,
  IDataWalletPersistence,
  PersistenceError,
  SiteVisit,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * This class is where we should implement the cloud-based data wallet persistence.
 * I think we can use Ceramic and/or bare IPFS to do this, so that the wallet data
 * can be accessed anywhere.
 */
export class DefaultDataWalletPersistence implements IDataWalletPersistence {
  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public addAccount(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getAccounts(): ResultAsync<EVMAccountAddress[], PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public addClick(click: ClickData): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getClicks(
    clickFilter: ClickFilter,
  ): ResultAsync<ClickData, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public setAge(age: number): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getAge(): ResultAsync<number, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getRejectedCohorts(): ResultAsync<
    EVMContractAddress[],
    PersistenceError
  > {
    throw new Error("Method not implemented.");
  }

  public addRejectedCohorts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public addEthereumTransactions(
    transactions: EVMTransaction[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
}
