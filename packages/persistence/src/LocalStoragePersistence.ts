import { URLString } from "@snickerdoodlelabs/objects";
import {
  Age,
  ClickData,
  ClickFilter,
  EmailAddressString,
  GivenName,
  Gender,
  IDataWalletPersistence,
  FamilyName,
  PersistenceError,
  SiteVisit,
  UnixTimestamp,
  CountryCode,
  EVMPrivateKey,
  EVMAccountAddress,
  EVMContractAddress,
  EVMTransaction,
  ChainId,
  IEVMBalance,
} from "@snickerdoodlelabs/objects";
import { LocalStorageUtils } from "@snickerdoodlelabs/utils";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

enum ELocalStorageKey {
  ACCOUNT = "SD_Accounts",
  AGE = "SD_Age",
  SITE_VISITS = "SD_SiteVisits",
  TRANSACTIONS = "SD_Transactions",
  FIRST_NAME = "SD_GivenName",
  LAST_NAME = "SD_FamilyName",
  BIRTHDAY = "SD_Birthday",
  GENDER = "SD_Gender",
  EMAIL = "SD_Email",
  LOCATION = "SD_Location",
}

export class LocalStoragePersistence implements IDataWalletPersistence {
  private _checkAndRetrieveValue<T>(
    key: ELocalStorageKey,
  ): ResultAsync<T, PersistenceError> {
    const value = LocalStorageUtils.readLocalStorage(key);
    if (!value) {
      return errAsync(
        new PersistenceError(`Key ${key} is not found in Local Storage!`),
      );
    }
    return okAsync(value as T);
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    return okAsync(undefined);
    throw new Error("Method not implemented.");
  }

  public getAccounts(): ResultAsync<EVMAccountAddress[], PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.ACCOUNT);
  }

  public addClick(click: ClickData): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getClicks(
    clickFilter: ClickFilter,
  ): ResultAsync<ClickData, PersistenceError> {
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
    const savedSiteVisits = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.SITE_VISITS,
    );
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.SITE_VISITS, [
      ...savedSiteVisits,
      siteVisits,
    ]);
    return okAsync(undefined);
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.SITE_VISITS);
  }

  public addEVMTransactions(
    transactions: EVMTransaction[],
  ): ResultAsync<void, PersistenceError> {
    const savedTransactions = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.TRANSACTIONS,
    );
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.TRANSACTIONS, [
      ...savedTransactions,
      ...transactions,
    ]);
    return okAsync(undefined);
  }

  public getLatestTransactionForAccount(
    chainId: ChainId,
    address: EVMAccountAddress,
  ): ResultAsync<EVMTransaction | null, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public addAccount(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<void, PersistenceError> {
    const accounts = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.ACCOUNT,
    );
    LocalStorageUtils.writeLocalStorage(
      ELocalStorageKey.ACCOUNT,
      Array.from(new Set([accountAddress, ...(accounts ?? [])])),
    );
    return okAsync(undefined);
  }

  public setAge(age: Age): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.AGE, age);
    return okAsync(undefined);
  }

  public getAge(): ResultAsync<Age, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.AGE);
  }

  public setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.FIRST_NAME, name);
    return okAsync(undefined);
  }

  public getGivenName(): ResultAsync<GivenName, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.FIRST_NAME);
  }

  public setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.FIRST_NAME, name);
    return okAsync(undefined);
  }

  public getFamilyName(): ResultAsync<FamilyName, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.LAST_NAME);
  }

  public setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.BIRTHDAY, birthday);
    return okAsync(undefined);
  }

  public getBirthday(): ResultAsync<UnixTimestamp, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.BIRTHDAY);
  }

  public setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.GENDER, gender);
    return okAsync(undefined);
  }

  public getGender(): ResultAsync<Gender, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.GENDER);
  }

  public setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.EMAIL, email);
    return okAsync(undefined);
  }

  public getEmail(): ResultAsync<EmailAddressString, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.EMAIL);
  }

  public setLocation(
    location: CountryCode,
  ): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.LOCATION, location);
    return okAsync(undefined);
  }

  public getLocation(): ResultAsync<CountryCode, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.LOCATION);
  }

  updateAccountBalances(
    balances: IEVMBalance[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  getURLs(): ResultAsync<Map<URLString, number>, PersistenceError>{
    throw new Error("Method not implemented.");
  }

}
