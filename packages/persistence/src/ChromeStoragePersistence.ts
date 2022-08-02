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
  JSONString,
} from "@snickerdoodlelabs/objects";
import { ChromeStorageUtils } from "@snickerdoodlelabs/utils";
import { okAsync, ResultAsync } from "neverthrow";

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

export class ChromeStoragePersistence implements IDataWalletPersistence {
  private _checkAndRetrieveValue<T>(
    key: ELocalStorageKey,
    defaultVal: T,
  ): ResultAsync<T, PersistenceError> {
    return ChromeStorageUtils.read<T>(key).map((val) => {
      return val ?? defaultVal;
    });
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
    return ChromeStorageUtils.read<JSONString>(ELocalStorageKey.CLICKS).andThen(
      (savedClicksJSON) => {
        const savedClicks = JSON.parse(savedClicksJSON ?? "[]") as ClickData[];

        const updated = [...savedClicks, click];

        return ChromeStorageUtils.write(
          ELocalStorageKey.CLICKS,
          JSON.stringify(updated),
        );
      },
    );
  }

  public getClicks(): ResultAsync<ClickData[], PersistenceError> {
    return this._checkAndRetrieveValue<JSONString>(
      ELocalStorageKey.CLICKS,
      JSONString("[]"),
    ).map((json) => {
      return JSON.parse(json) as ClickData[];
    });
  }

  public addRejectedCohorts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    return ChromeStorageUtils.read<EVMContractAddress[]>(
      ELocalStorageKey.REJECTED_COHORTS,
    ).andThen((saved) => {
      return ChromeStorageUtils.write(ELocalStorageKey.REJECTED_COHORTS, [
        ...(saved ?? []),
        consentContractAddresses,
      ]);
    });
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

  public addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, PersistenceError> {
    return ChromeStorageUtils.read<JSONString>(
      ELocalStorageKey.SITE_VISITS,
    ).andThen((savedSiteVisitsJSON) => {
      const savedClicks = JSON.parse(
        savedSiteVisitsJSON ?? "[]",
      ) as SiteVisit[];

      const updated = [...savedClicks, ...siteVisits];

      return ChromeStorageUtils.write(
        ELocalStorageKey.SITE_VISITS,
        JSON.stringify(updated),
      );
    });
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
    return ChromeStorageUtils.read<EVMContractAddress[]>(
      ELocalStorageKey.ACCOUNT,
    ).andThen((saved) => {
      return ChromeStorageUtils.write(ELocalStorageKey.ACCOUNT, [
        ...(saved ?? []),
        accountAddress,
      ]);
    });
  }

  public setAge(age: Age): ResultAsync<void, PersistenceError> {
    return ChromeStorageUtils.write(ELocalStorageKey.AGE, age);
  }

  public getAge(): ResultAsync<Age | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.AGE, null);
  }

  public setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    return ChromeStorageUtils.write(ELocalStorageKey.FIRST_NAME, name);
  }

  public getGivenName(): ResultAsync<GivenName | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.FIRST_NAME, null);
  }

  public setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    return ChromeStorageUtils.write(ELocalStorageKey.LAST_NAME, name);
  }

  public getFamilyName(): ResultAsync<FamilyName | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.LAST_NAME, null);
  }

  public setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, PersistenceError> {
    return ChromeStorageUtils.write(ELocalStorageKey.BIRTHDAY, birthday);
  }

  public getBirthday(): ResultAsync<UnixTimestamp | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.BIRTHDAY, null);
  }

  public setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    return ChromeStorageUtils.write(ELocalStorageKey.GENDER, gender);
  }

  public getGender(): ResultAsync<Gender | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.GENDER, null);
  }

  public setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, PersistenceError> {
    return ChromeStorageUtils.write(ELocalStorageKey.EMAIL, email);
  }

  public getEmail(): ResultAsync<EmailAddressString | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.EMAIL, null);
  }

  public setLocation(
    location: CountryCode,
  ): ResultAsync<void, PersistenceError> {
    return ChromeStorageUtils.write(ELocalStorageKey.LOCATION, location);
  }

  public getLocation(): ResultAsync<CountryCode | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.LOCATION, null);
  }

  public updateAccountBalances(
    balances: IEVMBalance[],
  ): ResultAsync<void, PersistenceError> {
    return ChromeStorageUtils.write(
      ELocalStorageKey.BALANCES,
      JSON.stringify(balances),
    );
  }

  public getAccountBalances(): ResultAsync<IEVMBalance[], PersistenceError> {
    return ChromeStorageUtils.read<JSONString>(ELocalStorageKey.BALANCES).map(
      (balances) => {
        if (balances == null) {
          return [];
        }
        return JSON.parse(balances) as IEVMBalance[];
      },
    );
  }

  public updateAccountNFTs(
    nfts: IEVMNFT[],
  ): ResultAsync<void, PersistenceError> {
    return ChromeStorageUtils.write(
      ELocalStorageKey.NFTS,
      JSON.stringify(nfts),
    );
  }

  public getAccountNFTs(): ResultAsync<IEVMNFT[], PersistenceError> {
    return ChromeStorageUtils.read<JSONString>(ELocalStorageKey.NFTS).map(
      (json) => {
        if (json == null) {
          return [];
        }
        return JSON.parse(json) as IEVMNFT[];
      },
    );
  }

  public addEVMTransactions(
    transactions: EVMTransaction[],
  ): ResultAsync<void, PersistenceError> {
    return ChromeStorageUtils.read<JSONString>(
      ELocalStorageKey.TRANSACTIONS,
    ).andThen((json) => {
      const arr = JSON.parse(json ?? "[]") as EVMTransaction[];

      const updated = [...arr, ...transactions];

      return ChromeStorageUtils.write(
        ELocalStorageKey.TRANSACTIONS,
        JSON.stringify(updated),
      );
    });
  }

  public getEVMTransactions(
    filter: EVMTransactionFilter,
  ): ResultAsync<EVMTransaction[], PersistenceError> {
    return this._checkAndRetrieveValue<JSONString>(
      ELocalStorageKey.TRANSACTIONS,
      JSONString("[]"),
    ).map((json) => {
      const transactions = JSON.parse(json) as EVMTransaction[];

      return transactions.filter((value) => {
        filter.matches(value);
      });
    });
  }

  public getLatestTransactionForAccount(
    chainId: ChainId,
    address: EVMAccountAddress,
  ): ResultAsync<EVMTransaction | null, PersistenceError> {
    return this.getEVMTransactions(
      new EVMTransactionFilter([chainId], [address]),
    ).map((transactions) => {
      if (transactions.length == 0) {
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tip = transactions.sort((a, b) => a.timestamp - b.timestamp).pop()!;
      return tip;
    });
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
    return ChromeStorageUtils.write(ELocalStorageKey.LATEST_BLOCK, blockNumber);
  }

  public getLatestBlockNumber(): ResultAsync<BlockNumber, PersistenceError> {
    return this._checkAndRetrieveValue(
      ELocalStorageKey.LATEST_BLOCK,
      BlockNumber(-1),
    );
  }
}
