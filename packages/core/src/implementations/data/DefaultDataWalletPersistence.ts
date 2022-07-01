import {
  Age,
  ClickData,
  ClickFilter,
  EmailAddressString,
  FirstName,
  Gender,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  EVMTransaction,
  IDataWalletPersistence,
  LastName,
  Location,
  PersistenceError,
  SiteVisit,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

/**
 * This class is where we should implement the cloud-based data wallet persistence.
 * I think we can use Ceramic and/or bare IPFS to do this, so that the wallet data
 * can be accessed anywhere.
 */
@injectable()
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

  public setAge(age: Age): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getAge(): ResultAsync<Age, PersistenceError> {
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
