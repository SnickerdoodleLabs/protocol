import {
  Age,
  ClickData,
  ClickFilter,
  EmailAddressString,
  EthereumAccountAddress,
  EthereumContractAddress,
  EthereumPrivateKey,
  EthereumTransaction,
  FirstName,
  Gender,
  IDataWalletPersistence,
  LastName,
  Location,
  PersistenceError,
  SiteVisit,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * This class is where we should implement the cloud-based data wallet persistence.
 * I think we can use Ceramic and/or bare IPFS to do this, so that the wallet data
 * can be accessed anywhere.
 */
export class DefaultDataWalletPersistence implements IDataWalletPersistence {
  getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
  setFirstName(name: FirstName): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  getFirstName(): ResultAsync<FirstName, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  setLastName(name: LastName): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  getLastName(): ResultAsync<LastName, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  getBirthday(): ResultAsync<UnixTimestamp, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  getGender(): ResultAsync<Gender, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  setEmail(email: EmailAddressString): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  getEmail(): ResultAsync<EmailAddressString, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  setLocation(location: Location): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  getLocation(): ResultAsync<Location, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  public unlock(
    derivedKey: EthereumPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public addAccount(
    accountAddress: EthereumAccountAddress,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getAccounts(): ResultAsync<
    EthereumAccountAddress[],
    PersistenceError
  > {
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

  public setAge(age: Age): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getAge(): ResultAsync<Age, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getRejectedCohorts(): ResultAsync<
    EthereumContractAddress[],
    PersistenceError
  > {
    throw new Error("Method not implemented.");
  }

  public addRejectedCohorts(
    consentContractAddresses: EthereumContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public addEthereumTransactions(
    transactions: EthereumTransaction[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
}
