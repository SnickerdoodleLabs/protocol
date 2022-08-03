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
  IAccountNFTsType,
  IAccountNFTs,
  IAccountBalancesType,
  IAccountBalances,
  EIndexer,
  AccountNFTError,
  AjaxError,
  AccountBalanceError,
} from "@snickerdoodlelabs/objects";
import { LocalStorageUtils } from "@snickerdoodlelabs/utils";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "./IPersistenceConfigProvider";

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
  BALANCES_LAST_UPDATE = "SD_Balances_lastUpdate",
  NFTS = "SD_NFTs",
  NFTS_LAST_UPDATE = "SD_NFTs_lastUpdate",
  URLs = "SD_URLs",
  CLICKS = "SD_CLICKS",
  REJECTED_COHORTS = "SD_RejectedCohorts",
  LATEST_BLOCK = "SD_LatestBlock",
}

export class LocalStoragePersistence implements IDataWalletPersistence {
  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(IAccountNFTsType)
    protected accountNFTs: IAccountNFTs,
    @inject(IAccountBalancesType) protected accountBalances: IAccountBalances,
  ) {}

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

    let savedSiteVisits = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.SITE_VISITS,
    );
    if (savedSiteVisits == null){
      savedSiteVisits = [];
    }
    var totalVisits = savedSiteVisits.concat(siteVisits);
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.SITE_VISITS, savedSiteVisits.concat(siteVisits));
    return okAsync(undefined);
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError> {
    /*
    const checkVal = this._checkAndRetrieveValue<SiteVisit[]>(
      ELocalStorageKey.SITE_VISITS,
      [],
    );
    */
    const savedSiteVisits = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.SITE_VISITS,
    );
    //console.log("savedSiteVisits: ", savedSiteVisits);
    return okAsync(savedSiteVisits);
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

  public updateAccountBalances(
    balances: IEVMBalance[],
  ): ResultAsync<IEVMBalance[], PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.BALANCES, balances);
    LocalStorageUtils.writeLocalStorage(
      ELocalStorageKey.BALANCES_LAST_UPDATE,
      new Date().getTime(),
    );
    return okAsync(balances);
  }

  public getAccountBalances(): ResultAsync<IEVMBalance[], PersistenceError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this._checkAndRetrieveValue<number>(
        ELocalStorageKey.BALANCES_LAST_UPDATE,
        0,
      ),
    ]).andThen(([config, lastUpdate]) => {
      const currTime = new Date().getTime();
      if (currTime - lastUpdate < config.accountBalancePollingIntervalMS) {
        return this._checkAndRetrieveValue<IEVMBalance[]>(
          ELocalStorageKey.BALANCES,
          [],
        );
      }

      return this.pollBalances().mapErr(
        (e) => new PersistenceError(`${e.name}: ${e.message}`),
      );
    });
  }

  private pollBalances(): ResultAsync<
    IEVMBalance[],
    PersistenceError | AccountBalanceError | AjaxError
  > {
    return ResultUtils.combine([
      this.getAccounts(),
      this.configProvider.getConfig(),
    ])
      .andThen(([accountAddresses, config]) => {
        return ResultUtils.combine(
          accountAddresses.map((accountAddress) => {
            return ResultUtils.combine(
              config.supportedChains.map((chainId) => {
                return this.getLatestBalances(chainId, accountAddress);
              }),
            );
          }),
        );
      })
      .andThen((balancesArr) => {
        const balances = balancesArr.flat(2);
        return this.updateAccountBalances(balances);
      });
  }

  private getLatestBalances(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    IEVMBalance[],
    PersistenceError | AccountBalanceError | AjaxError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.accountBalances.getEVMBalanceRepository(),
      this.accountBalances.getSimulatorEVMBalanceRepository(),
    ]).andThen(([config, evmRepo, simulatorRepo]) => {
      const chainInfo = config.chainInformation.get(chainId);
      if (chainInfo == null) {
        return errAsync(
          new AccountBalanceError(
            `No available chain info for chain ${chainId}`,
          ),
        );
      }

      switch (chainInfo.indexer) {
        case EIndexer.EVM:
          return evmRepo.getBalancesForAccount(chainId, accountAddress);
        case EIndexer.Simulator:
          return simulatorRepo.getBalancesForAccount(chainId, accountAddress);
        default:
          return errAsync(
            new AccountBalanceError(
              `No available balance repository for chain ${chainId}`,
            ),
          );
      }
    });
  }

  public updateAccountNFTs(
    nfts: IEVMNFT[],
  ): ResultAsync<IEVMNFT[], PersistenceError> {
    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.NFTS, nfts);
    LocalStorageUtils.writeLocalStorage(
      ELocalStorageKey.NFTS_LAST_UPDATE,
      new Date().getTime(),
    );
    return okAsync(nfts);
  }

  public getAccountNFTs(): ResultAsync<IEVMNFT[], PersistenceError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this._checkAndRetrieveValue<number>(ELocalStorageKey.NFTS_LAST_UPDATE, 0),
    ]).andThen(([config, lastUpdate]) => {
      const currTime = new Date().getTime();
      if (currTime - lastUpdate < config.accountNFTPollingIntervalMS) {
        return this._checkAndRetrieveValue<IEVMNFT[]>(
          ELocalStorageKey.NFTS,
          [],
        );
      }

      return this.pollNFTs().mapErr(
        (e) => new PersistenceError(`${e.name}: ${e.message}`),
      );
    });
  }

  private pollNFTs(): ResultAsync<
    IEVMNFT[],
    PersistenceError | AjaxError | AccountNFTError
  > {
    return ResultUtils.combine([
      this.getAccounts(),
      this.configProvider.getConfig(),
    ])
      .andThen(([accountAddresses, config]) => {
        return ResultUtils.combine(
          accountAddresses.map((accountAddress) => {
            return ResultUtils.combine(
              config.supportedChains.map((chainId) => {
                return this.getLatestNFTs(chainId, accountAddress);
              }),
            );
          }),
        );
      })
      .andThen((nftArr) => {
        const nfts = nftArr.flat(2);
        return this.updateAccountNFTs(nfts);
      });
  }

  private getLatestNFTs(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMNFT[], PersistenceError | AccountNFTError | AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.accountNFTs.getEVMNftRepository(),
      this.accountNFTs.getSimulatorEVMNftRepository(),
    ]).andThen(([config, evmRepo, simulatorRepo]) => {
      const chainInfo = config.chainInformation.get(chainId);
      if (chainInfo == null) {
        return errAsync(
          new AccountNFTError(`No available chain info for chain ${chainId}`),
        );
      }

      switch (chainInfo.indexer) {
        case EIndexer.EVM:
          return evmRepo.getTokensForAccount(chainId, accountAddress);
        case EIndexer.Simulator:
          return simulatorRepo.getTokensForAccount(chainId, accountAddress);
        default:
          return errAsync(
            new AccountNFTError(
              `No available token repository for chain ${chainId}`,
            ),
          );
      }
    });
  }

  public addEVMTransactions(
    transactions: EVMTransaction[],
  ): ResultAsync<void, PersistenceError> {
    const savedTransactions = LocalStorageUtils.readLocalStorage(
      ELocalStorageKey.TRANSACTIONS,
    );

    const existing = new Set([
      (savedTransactions ?? []).map((tx) => tx.hash.toLowerCase()),
    ]);
    const newTxs = transactions.filter(
      (tx) => !existing.has(tx.hash.toLowerCase()),
    );

    LocalStorageUtils.writeLocalStorage(ELocalStorageKey.TRANSACTIONS, [
      ...(savedTransactions ?? []),
      ...newTxs,
    ]);
    return okAsync(undefined);
  }

  public getEVMTransactions(
    filter?: EVMTransactionFilter,
  ): ResultAsync<EVMTransaction[], PersistenceError> {
    return this._checkAndRetrieveValue<EVMTransaction[]>(
      ELocalStorageKey.TRANSACTIONS,
      [],
    )
      .andThen((transactions) => {
        if (filter == undefined) {
          return okAsync(transactions);
        }

        const filtered = transactions.filter((value) => {
          return filter.matches(value);
        });

        return okAsync(filtered);
      })
      .orElse((_e) => okAsync([]));
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

  // return a map of URLs
  public getSiteVisitsMap(): ResultAsync<
    Map<URLString, number>,
    PersistenceError
  > {
    return this.getSiteVisits().andThen((siteVisits) => {
      const result = new Map<URLString, number>();
      if (siteVisits == null){
        return okAsync(result)
      }
      siteVisits.forEach((siteVisit, _i, _arr) => {
        /*
        console.log("siteVisit: ", siteVisit);
        console.log("_i: ", _i);
        console.log("_arr: ", _arr); 
        */    
        // const baseUrl = new URL(siteVisit.url).pathname;
        let url = siteVisit.url;
        //console.log("url: ", url);     
        //let urlval = new URL(url);
        let baseUrl = URLString(url);
        //console.log("path: ", baseUrl);
        baseUrl in result || (result[baseUrl] = 0);
        //console.log("baseUrl: ", baseUrl);
        result[baseUrl] += 1;
      });
      return okAsync(result);
    });
  }

  // return a map of Chain Transaction Counts
  public getTransactionsMap(): ResultAsync<
    Map<ChainId, number>,
    PersistenceError
  > {
    this.getLatestTransactionForAccount(
      ChainId(42),
      EVMAccountAddress("0xd4908f76d7dd381f7091667e5b9cf67089b7c6f8"),
    ).map(console.log);

    return this.getEVMTransactions().andThen((transactions) => {
      const result = new Map<ChainId, number>();
      transactions.forEach((tx, _i, _arr) => {
        tx.chainId in result || (result[tx.chainId] = 0);
        result[tx.chainId] += 1;
      });
      return okAsync(result);
    });
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
