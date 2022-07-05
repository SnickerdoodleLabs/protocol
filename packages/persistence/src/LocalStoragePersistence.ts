import {
  Age,
  ClickData,
  ClickFilter,
  EmailAddressString,
  FirstName,
  Gender,
  IDataWalletPersistence,
  LastName,
  PersistenceError,
  SiteVisit,
  UnixTimestamp,
  Location,
  EVMPrivateKey,
  EVMAccountAddress,
  EVMContractAddress,
  EVMTransaction,
} from "@snickerdoodlelabs/objects";
import { LocalStorageUtils } from "@snickerdoodlelabs/utils";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

enum ELocalStorageKey {
  ACCOUNT = "SD_Accounts",
  AGE = "SD_Age",
  SITE_VISITS = "SD_SiteVisits",
  TRANSACTIONS = "SD_Transactions",
  FIRST_NAME = "SD_FirstName",
  LAST_NAME = "SD_LastName",
  BIRTHDAY = "SD_Birthday",
  GENDER = "SD_Gender",
  EMAIL = "SD_Email",
  LOCATION = "SD_Location",
}

function checkAndRetrieveValue<T>(
  key: ELocalStorageKey,
): ResultAsync<T, PersistenceError> {
  const value = LocalStorageUtils.readLocalStorage(ELocalStorageKey.AGE);
  if (!value) {
    return errAsync(
      new PersistenceError(`Key ${key} is not found in Local Storage!`),
    );
  }
  return okAsync(value as T);
}

export const LocalStoragePersistence: IDataWalletPersistence = {
  unlock(derivedKey: EVMPrivateKey): ResultAsync<void, PersistenceError> {
    return okAsync(undefined);
    throw new Error("Method not implemented.");
  },
  getAccounts(): ResultAsync<EVMAccountAddress[], PersistenceError> {
    return checkAndRetrieveValue(ELocalStorageKey.ACCOUNT);
  },
  addClick(click: ClickData): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  },
  getClicks(
    clickFilter: ClickFilter,
  ): ResultAsync<ClickData, PersistenceError> {
    throw new Error("Method not implemented.");
  },
  getRejectedCohorts(): ResultAsync<EVMContractAddress[], PersistenceError> {
    throw new Error("Method not implemented.");
  },
  addRejectedCohorts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  },
  addSiteVisits(siteVisits: SiteVisit[]): ResultAsync<void, PersistenceError> {
    const savedSiteVisits = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.SITE_VISITS,
    );
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.SITE_VISITS, [
      ...savedSiteVisits,
      siteVisits,
    ]);
    return okAsync(undefined);
  },
  getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError> {
    return checkAndRetrieveValue(ELocalStorageKey.SITE_VISITS);
  },
  addEthereumTransactions(
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
  },
  addAccount(
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
  },
  setAge(age: Age): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.AGE, age);
    return okAsync(undefined);
  },
  getAge(): ResultAsync<Age, PersistenceError> {
    return checkAndRetrieveValue(ELocalStorageKey.AGE);
  },
  setFirstName: function (
    name: FirstName,
  ): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.FIRST_NAME, name);
    return okAsync(undefined);
  },
  getFirstName: function (): ResultAsync<FirstName, PersistenceError> {
    return checkAndRetrieveValue(ELocalStorageKey.FIRST_NAME);
  },
  setLastName: function (name: LastName): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.FIRST_NAME, name);
    return okAsync(undefined);
  },
  getLastName: function (): ResultAsync<LastName, PersistenceError> {
    return checkAndRetrieveValue(ELocalStorageKey.LAST_NAME);
  },
  setBirthday: function (
    birthday: UnixTimestamp,
  ): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.BIRTHDAY, birthday);
    return okAsync(undefined);
  },
  getBirthday: function (): ResultAsync<UnixTimestamp, PersistenceError> {
    return checkAndRetrieveValue(ELocalStorageKey.BIRTHDAY);
  },
  setGender: function (gender: Gender): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.GENDER, gender);
    return okAsync(undefined);
  },
  getGender: function (): ResultAsync<Gender, PersistenceError> {
    return checkAndRetrieveValue(ELocalStorageKey.GENDER);
  },
  setEmail: function (
    email: EmailAddressString,
  ): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.EMAIL, email);
    return okAsync(undefined);
  },
  getEmail: function (): ResultAsync<EmailAddressString, PersistenceError> {
    return checkAndRetrieveValue(ELocalStorageKey.EMAIL);
  },
  setLocation: function (
    location: Location,
  ): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.LOCATION, location);
    return okAsync(undefined);
  },
  getLocation: function (): ResultAsync<Location, PersistenceError> {
    return checkAndRetrieveValue(ELocalStorageKey.LOCATION);
  },
};
