import {
  URLString,
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
  IEVMNFT,
  EVMTransactionFilter,
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
  BALANCES = "SD_Balances",
  NFTS = "SD_NFTs",
  URLs = "SD_URLs",
  CLICKS = "SD_CLICKS",
  REJECTED_COHORTS = "SD_RejectedCohorts",
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
    const savedClicks = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.CLICKS,
    );
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.CLICKS, [
      ...savedClicks,
      click,
    ]);
    return okAsync(undefined);
  }

  public getClicks(
    clickFilter: ClickFilter,
  ): ResultAsync<ClickData, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.CLICKS);
  }

  public getRejectedCohorts(): ResultAsync<
    EVMContractAddress[],
    PersistenceError
  > {
    return this._checkAndRetrieveValue(ELocalStorageKey.REJECTED_COHORTS);
  }

  public addRejectedCohorts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    const saved = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.REJECTED_COHORTS,
    );
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.REJECTED_COHORTS, [
      ...saved,
      consentContractAddresses,
    ]);
    return okAsync(undefined);
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

  public updateAccountBalances(
    balances: IEVMBalance[],
  ): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.BALANCES, balances);
    return okAsync(undefined);
  }

  public addURL(url: URLString): ResultAsync<void, PersistenceError> {
    const urls = LocalStorageUtils.readLocalStorage(ELocalStorageKey.URLs);
    LocalStorageUtils.writeLocalStorage(
      ELocalStorageKey.URLs,
      Array.from(new Set([...urls, url])),
    );
    return okAsync(undefined);
  }

  public getURLs(): ResultAsync<Map<URLString, number>, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.URLs);
  }

  public updateAccountNFTs(
    nfts: IEVMNFT[],
  ): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.NFTS, nfts);
    return okAsync(undefined);
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

  public getEVMTransactions(
    filter: EVMTransactionFilter,
  ): ResultAsync<EVMTransaction[], PersistenceError> {
    return this._checkAndRetrieveValue<EVMTransaction[]>(
      ELocalStorageKey.TRANSACTIONS,
    ).andThen((transactions) => {
      return okAsync(
        transactions.filter((value) => {
          filter.matches(value);
        }),
      );
    });
  }

  public getLatestTransactionForAccount(
    chainId: ChainId,
    address: EVMAccountAddress,
  ): ResultAsync<EVMTransaction | null, PersistenceError> {
    return this.getEVMTransactions(
      new EVMTransactionFilter([chainId], [address]),
    ).andThen((transactions) => {
      if (transactions.length == 0) {
        return okAsync(null);
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tip = transactions.sort((a, b) => a.timestamp - b.timestamp).pop()!;
      return okAsync(tip);
    });
  }

  public getAccountBalances(): ResultAsync<IEVMBalance[], PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.BALANCES);
  }
  public getAccountNFTs(): ResultAsync<IEVMNFT[], PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.NFTS);
  }
}
