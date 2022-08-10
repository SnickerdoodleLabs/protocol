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
  IAccountBalances,
  IAccountBalancesType,
  IAccountNFTs,
  IAccountNFTsType,
  AccountNFTError,
  AjaxError,
  EIndexer,
  AccountBalanceError,
  AccountIndexingError,
  IAccountIndexingType,
  IAccountIndexing,
} from "@snickerdoodlelabs/objects";
import {
  IStorageUtils,
  IStorageUtilsType,
  IndexeDBUtils,
} from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";
import { errAsync, ok, okAsync, ResultAsync } from "neverthrow";
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

@injectable()
export class DataWalletPersistence implements IDataWalletPersistence {
  private indexedDB = new IndexeDBUtils("SD_Wallet", [
    {
      name: ELocalStorageKey.TRANSACTIONS,
      keyPath: "hash",
      indexBy: [
        ["timestamp", false],
        ["chainId", false],
        ["value", false],
      ],
    },
  ]);

  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(IAccountNFTsType)
    protected accountNFTs: IAccountNFTs,
    @inject(IAccountBalancesType) protected accountBalances: IAccountBalances,
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
  ) {}

  private _checkAndRetrieveValue<T>(
    key: ELocalStorageKey,
    defaultVal: T,
  ): ResultAsync<T, PersistenceError> {
    return this.storageUtils.read<T>(key).map((val) => {
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
    return this.storageUtils
      .read<JSONString>(ELocalStorageKey.CLICKS)
      .andThen((savedClicksJSON) => {
        const savedClicks = JSON.parse(savedClicksJSON ?? "[]") as ClickData[];

        const updated = [...savedClicks, click];

        return this.storageUtils.write(
          ELocalStorageKey.CLICKS,
          JSON.stringify(updated),
        );
      });
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
    return this.storageUtils
      .read<EVMContractAddress[]>(ELocalStorageKey.REJECTED_COHORTS)
      .andThen((saved) => {
        return this.storageUtils.write(ELocalStorageKey.REJECTED_COHORTS, [
          ...(saved ?? []),
          ...consentContractAddresses,
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
    return this.storageUtils
      .read<JSONString>(ELocalStorageKey.SITE_VISITS)
      .andThen((savedSiteVisitsJSON) => {
        const savedClicks = JSON.parse(
          savedSiteVisitsJSON ?? "[]",
        ) as SiteVisit[];

        const updated = [...savedClicks, ...siteVisits];

        return this.storageUtils.write(
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
    return this.storageUtils
      .read<EVMContractAddress[]>(ELocalStorageKey.ACCOUNT)
      .andThen((saved) => {
        return this.storageUtils.write(
          ELocalStorageKey.ACCOUNT,
          Array.from(new Set([...(saved ?? []), accountAddress])),
        );
      });
  }

  public setAge(age: Age): ResultAsync<void, PersistenceError> {
    return this.storageUtils.write(ELocalStorageKey.AGE, age);
  }

  public getAge(): ResultAsync<Age | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.AGE, null);
  }

  public setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    return this.storageUtils.write(ELocalStorageKey.FIRST_NAME, name);
  }

  public getGivenName(): ResultAsync<GivenName | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.FIRST_NAME, null);
  }

  public setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    return this.storageUtils.write(ELocalStorageKey.LAST_NAME, name);
  }

  public getFamilyName(): ResultAsync<FamilyName | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.LAST_NAME, null);
  }

  public setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, PersistenceError> {
    return this.storageUtils.write(ELocalStorageKey.BIRTHDAY, birthday);
  }

  public getBirthday(): ResultAsync<UnixTimestamp | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.BIRTHDAY, null);
  }

  public setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    return this.storageUtils.write(ELocalStorageKey.GENDER, gender);
  }

  public getGender(): ResultAsync<Gender | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.GENDER, null);
  }

  public setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, PersistenceError> {
    return this.storageUtils.write(ELocalStorageKey.EMAIL, email);
  }

  public getEmail(): ResultAsync<EmailAddressString | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.EMAIL, null);
  }

  public setLocation(
    location: CountryCode,
  ): ResultAsync<void, PersistenceError> {
    return this.storageUtils.write(ELocalStorageKey.LOCATION, location);
  }

  public getLocation(): ResultAsync<CountryCode | null, PersistenceError> {
    return this._checkAndRetrieveValue(ELocalStorageKey.LOCATION, null);
  }

  public updateAccountBalances(
    balances: IEVMBalance[],
  ): ResultAsync<IEVMBalance[], PersistenceError> {
    return this.storageUtils
      .write(ELocalStorageKey.BALANCES, JSON.stringify(balances))
      .andThen(() => {
        return this.storageUtils
          .write(ELocalStorageKey.BALANCES_LAST_UPDATE, new Date().getTime())
          .andThen(() => {
            return okAsync(balances);
          });
      });
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
    return this.storageUtils
      .write(ELocalStorageKey.NFTS, JSON.stringify(nfts))
      .andThen(() => {
        return this.storageUtils
          .write(ELocalStorageKey.NFTS_LAST_UPDATE, new Date().getTime())
          .andThen(() => {
            return okAsync(nfts);
          });
      });
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
    return ResultUtils.combine(
      transactions.map((tx) => {
        return this.indexedDB.putObject<EVMTransaction>(
          ELocalStorageKey.TRANSACTIONS,
          tx,
        );
      }),
    ).andThen(() => okAsync(undefined));
  }

  public getEVMTransactions(
    filter?: EVMTransactionFilter,
  ): ResultAsync<EVMTransaction[], PersistenceError> {
    return this.indexedDB
      .getAll<EVMTransaction>(ELocalStorageKey.TRANSACTIONS)
      .andThen((transactions) => {
        if (filter == undefined) {
          return okAsync(transactions);
        }

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
    const filter = new EVMTransactionFilter([chainId], [address]);
    return this.indexedDB
      .getCursor(ELocalStorageKey.TRANSACTIONS, "timestamp", undefined, "prev")
      .andThen((cursor) => {
        while (cursor) {
          const tx = cursor.value as EVMTransaction;
          if (filter.matches(tx)) {
            return okAsync(tx);
          }

          cursor.continue();
        }

        return okAsync(null);
      });
  }

  // return a map of URLs
  public getSiteVisitsMap(): ResultAsync<
    Map<URLString, number>,
    PersistenceError
  > {
    return this.getSiteVisits().andThen((siteVisits) => {
      const result = new Map<URLString, number>();
      siteVisits.forEach((siteVisit, _i, _arr) => {
        const url = siteVisit.url;
        const baseUrl = URLString(url);
        baseUrl in result || (result[baseUrl] = 0);
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
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const chains = Array.from(config.chainInformation.keys());
        return ResultUtils.combine(
          chains.map((chain) => {
            return this.indexedDB
              .getAllKeys(
                ELocalStorageKey.TRANSACTIONS,
                "chainId",
                IDBKeyRange.only(chain),
              )
              .andThen((keys) => {
                return okAsync([chain, keys.length]);
              });
          }),
        );
      })
      .andThen((result) => {
        const returnVal = new Map<ChainId, number>();
        for (const elem in result) {
          const [chain, num] = elem;
          returnVal[chain] = num;
        }
        return okAsync(returnVal);
      });
  }

  public setLatestBlockNumber(
    blockNumber: BlockNumber,
  ): ResultAsync<void, PersistenceError> {
    return this.storageUtils.write(ELocalStorageKey.LATEST_BLOCK, blockNumber);
  }

  public getLatestBlockNumber(): ResultAsync<BlockNumber, PersistenceError> {
    return this._checkAndRetrieveValue(
      ELocalStorageKey.LATEST_BLOCK,
      BlockNumber(-1),
    );
  }
}
