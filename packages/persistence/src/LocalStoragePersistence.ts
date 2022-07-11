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
} from "@snickerdoodlelabs/objects";
import { ChainId } from "@snickerdoodlelabs/objects";
import { LocalStorageUtils } from "@snickerdoodlelabs/utils";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { BlockNumber } from "@snickerdoodlelabs/objects";
import { AccountIndexingError } from "@snickerdoodlelabs/objects";
import { NormalModuleReplacementPlugin } from "webpack";


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
    const value = LocalStorageUtils.readLocalStorage(ELocalStorageKey.AGE);
    if (!value) {
      return errAsync(
        new PersistenceError(`Key ${key} is not found in Local Storage!`),
      );
    }
    return okAsync(value as T);
  }
  unlock(derivedKey: EVMPrivateKey): ResultAsync<void, PersistenceError> {
    return okAsync(undefined);
    throw new Error("Method not implemented.");
  }
  getAccounts(): ResultAsync<EVMAccountAddress[], PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.ACCOUNT);
  }
  addClick(click: ClickData): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  getClicks(
    clickFilter: ClickFilter,
  ): ResultAsync<ClickData, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  getRejectedCohorts(): ResultAsync<EVMContractAddress[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
  addRejectedCohorts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  addSiteVisits(siteVisits: SiteVisit[]): ResultAsync<void, PersistenceError> {
    const savedSiteVisits = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.SITE_VISITS,
    );
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.SITE_VISITS, [
      ...savedSiteVisits,
      siteVisits,
    ]);
    return okAsync(undefined);
  }
  getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.SITE_VISITS);
  }
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
  }
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
  }
  setAge(age: Age): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.AGE, age);
    return okAsync(undefined);
  }
  getAge(): ResultAsync<Age, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.AGE);
  }
  setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.FIRST_NAME, name);
    return okAsync(undefined);
  }
  getGivenName(): ResultAsync<GivenName, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.FIRST_NAME);
  }
  setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.FIRST_NAME, name);
    return okAsync(undefined);
  }
  getFamilyName(): ResultAsync<FamilyName, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.LAST_NAME);
  }
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.BIRTHDAY, birthday);
    return okAsync(undefined);
  }
  getBirthday(): ResultAsync<UnixTimestamp, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.BIRTHDAY);
  }
  setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.GENDER, gender);
    return okAsync(undefined);
  }
  getGender(): ResultAsync<Gender, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.GENDER);
  }
  setEmail(email: EmailAddressString): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.EMAIL, email);
    return okAsync(undefined);
  }
  getEmail(): ResultAsync<EmailAddressString, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.EMAIL);
  }
  setLocation(location: CountryCode): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.LOCATION, location);
    return okAsync(undefined);
  }
  getLocation(): ResultAsync<CountryCode, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.LOCATION);
  }

  getLatestTransactionForAccount(chainId: ChainId, address: EVMAccountAddress,
  ): ResultAsync<EVMTransaction | null, PersistenceError>{
    return okAsync(null)
  }

  addEVMTransactions(
    transactions: EVMTransaction[],
  ): ResultAsync<void, PersistenceError>{
    return okAsync(undefined);
  }

  getEVMTransactions(
    accountAddress: EVMAccountAddress,
    firstBlock: BlockNumber,
    lastBlock?: BlockNumber | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError>{
    let setEVM: EVMTransaction[] = []
    return okAsync(setEVM);
  }

}
