import {
  URLString,
  Age,
  ClickData,
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
  BlockNumber,
} from "@snickerdoodlelabs/objects";
import { LocalStorageUtils } from "@snickerdoodlelabs/utils";
import { errAsync, ok, okAsync, ResultAsync } from "neverthrow";

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
  LATEST_BLOCK = "SD_LatestBlock",
}

export class LocalStoragePersistence implements IDataWalletPersistence {
  private _checkAndRetrieveValue<T>(
    key: ELocalStorageKey,
    defaultVal: T,
  ): ResultAsync<T, PersistenceError> {
    const value = LocalStorageUtils.readLocalStorage(key);
    if (!value) {
      return okAsync(defaultVal);
    }
    return okAsync(value as T);
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    return okAsync(undefined);
  }

  public getAccounts(): ResultAsync<EVMAccountAddress[], PersistenceError> {
    return this._checkAndRetrieveValue<EVMAccountAddress[]>(
      ELocalStorageKey.ACCOUNT,
      [],
    );
  }

  public addClick(click: ClickData): ResultAsync<void, PersistenceError> {
    const savedClicks = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.CLICKS,
    );
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.CLICKS, [
      ...(savedClicks ?? []),
      click,
    ]);
    return okAsync(undefined);
  }

  public getClicks(): ResultAsync<ClickData[], PersistenceError> {
    return this._checkAndRetrieveValue<ClickData[]>(
      ELocalStorageKey.CLICKS,
      [],
    );
  }

  public getRejectedCohorts(): ResultAsync<
    EVMContractAddress[],
    PersistenceError
  > {
    return this._checkAndRetrieveValue<EVMContractAddress[]>(
      ELocalStorageKey.REJECTED_COHORTS,
      [],
    );
  }

  public addRejectedCohorts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    const saved = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.REJECTED_COHORTS,
    );
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.REJECTED_COHORTS, [
      ...(saved ?? []),
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
      ...(savedSiteVisits ?? []),
      siteVisits,
    ]);
    return okAsync(undefined);
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError> {
    return this._checkAndRetrieveValue<SiteVisit[]>(
      ELocalStorageKey.SITE_VISITS,
      [],
    );
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

  public getAge(): ResultAsync<Age | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.AGE, null);
  }

  public setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.FIRST_NAME, name);
    return okAsync(undefined);
  }

  public getGivenName(): ResultAsync<GivenName | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.FIRST_NAME, null);
  }

  public setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.LAST_NAME, name);
    return okAsync(undefined);
  }

  public getFamilyName(): ResultAsync<FamilyName | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.LAST_NAME, null);
  }

  public setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.BIRTHDAY, birthday);
    return okAsync(undefined);
  }

  public getBirthday(): ResultAsync<UnixTimestamp | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.BIRTHDAY, null);
  }

  public setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.GENDER, gender);
    return okAsync(undefined);
  }

  public getGender(): ResultAsync<Gender | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.GENDER, null);
  }

  public setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.EMAIL, email);
    return okAsync(undefined);
  }

  public getEmail(): ResultAsync<EmailAddressString | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.EMAIL, null);
  }

  public setLocation(
    location: CountryCode,
  ): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.LOCATION, location);
    return okAsync(undefined);
  }

  public getLocation(): ResultAsync<CountryCode | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.LOCATION, null);
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
    return this._checkAndRetrieveValue(
      ELocalStorageKey.URLs,
      new Map<URLString, number>(),
    );
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
      ...(savedTransactions ?? []),
      ...transactions,
    ]);
    return okAsync(undefined);
  }

  public getEVMTransactions(
    filter: EVMTransactionFilter,
  ): ResultAsync<EVMTransaction[], PersistenceError> {
    return this._checkAndRetrieveValue<EVMTransaction[]>(
      ELocalStorageKey.TRANSACTIONS,
      [],
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
    return this._checkAndRetrieveValue<IEVMBalance[]>(
      ELocalStorageKey.BALANCES,
      [],
    );
  }
  public getAccountNFTs(): ResultAsync<IEVMNFT[], PersistenceError> {
    return this._checkAndRetrieveValue<IEVMNFT[]>(ELocalStorageKey.NFTS, []);
  }

  // return a map of URLs
  public getSiteVisitsMap(): ResultAsync<
    Map<URLString, number>,
    PersistenceError
  > {
    throw new Error("Method not implemented.");
  }

  // return a map of Chain Transaction Counts
  public getTransactionsMap(): ResultAsync<
    Map<ChainId, number>,
    PersistenceError
  > {
    throw new Error("Method not implemented.");
  }

  public setLatestBlockNumber(
    blockNumber: BlockNumber,
  ): ResultAsync<void, PersistenceError> {
    LocalStorageUtils.writeLocalStorage(
      ELocalStorageKey.LATEST_BLOCK,
      blockNumber,
    );
    return okAsync(undefined);
  }

  public getLatestBlockNumber(): ResultAsync<BlockNumber, PersistenceError> {
    return this._checkAndRetrieveValue(
      ELocalStorageKey.LATEST_BLOCK,
      BlockNumber(-1),
    );
  }
}
