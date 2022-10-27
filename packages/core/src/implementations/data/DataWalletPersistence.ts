import {
  ICryptoUtils,
  ICryptoUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
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
  BlockNumber,
  IAccountBalances,
  IAccountBalancesType,
  IAccountNFTs,
  IAccountNFTsType,
  AjaxError,
  EIndexer,
  IDataWalletBackup,
  BigNumberString,
  LinkedAccount,
  EChainTechnology,
  getChainInfoByChain,
  IChainTransaction,
  CeramicStreamID,
  EarnedReward,
  TransactionFilter,
  getChainInfoByChainId,
  TokenBalance,
  AccountIndexingError,
  AccountAddress,
  SolanaAccountAddress,
  IAccountNFT,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, Result, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { 
  BackupManager, 
  ICloudStorage,
  ICloudStorageType, 
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType, 
  IVolatileStorageTable,
  IVolatileStorageFactory,
  IVolatileStorageFactoryType,
  IVolatileCursor,
} from "@snickerdoodlelabs/persistence";

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
  EARNED_REWARDS = "SD_EarnedRewards",
}

interface LatestBlockEntry {
  contract: EVMContractAddress;
  block: BlockNumber;
}

@injectable()
export class DataWalletPersistence implements IDataWalletPersistence {
  private objectStore?: ResultAsync<IVolatileStorageTable, PersistenceError>;

  private backupManager?: ResultAsync<BackupManager, PersistenceError>;

  private unlockPromise: Promise<EVMPrivateKey>;
  private resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null = null;

  private restorePromise: Promise<void>;
  private resolveRestore: (() => void) | null = null;

  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(IAccountNFTsType)
    protected accountNFTs: IAccountNFTs,
    @inject(IAccountBalancesType) protected accountBalances: IAccountBalances,
    @inject(IStorageUtilsType) protected persistentStorageUtils: IStorageUtils,
    @inject(IVolatileStorageFactoryType)
    protected volatileStorageFactory: IVolatileStorageFactory,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(ICloudStorageType) protected cloudStorage: ICloudStorage,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.objectStore = undefined;
    this.unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this.resolveUnlock = resolve;
    });
    this.restorePromise = new Promise<void>((resolve) => {
      this.resolveRestore = resolve;
    });
  }

  private _getBackupManager(): ResultAsync<BackupManager, PersistenceError> {
    if (this.backupManager != undefined) {
      return this.backupManager;
    }

    this.backupManager = this.waitForUnlock().andThen((key) => {
      return this._getObjectStore().map((store) => {
        return new BackupManager(
          key,
          [
            ELocalStorageKey.ACCOUNT,
            // ELocalStorageKey.TRANSACTIONS,
            ELocalStorageKey.SITE_VISITS,
            ELocalStorageKey.CLICKS,
            ELocalStorageKey.LATEST_BLOCK,
            ELocalStorageKey.EARNED_REWARDS,
          ],
          store,
          this.cryptoUtils,
          this.persistentStorageUtils,
        );
      });
    });
    return this.backupManager;
  }

  private _getObjectStore(): ResultAsync<
    IVolatileStorageTable,
    PersistenceError
  > {
    if (this.objectStore != undefined) {
      return this.objectStore;
    }

    this.objectStore = this.volatileStorageFactory.getStore({
      name: "SD_Wallet",
      schema: [
        {
          name: ELocalStorageKey.ACCOUNT,
          keyPath: "sourceAccountAddress",
          autoIncrement: false,
          indexBy: [["sourceChain", false]],
        },
        {
          name: ELocalStorageKey.TRANSACTIONS,
          keyPath: "hash",
          indexBy: [
            ["timestamp", false],
            ["chainId", false],
            ["value", false],
            ["to", false],
            ["from", false],
          ],
        },
        {
          name: ELocalStorageKey.SITE_VISITS,
          keyPath: "id",
          autoIncrement: true,
          indexBy: [
            ["url", false],
            ["startTime", false],
            ["endTime", false],
          ],
        },
        {
          name: ELocalStorageKey.CLICKS,
          keyPath: "id",
          autoIncrement: true,
          indexBy: [
            ["url", false],
            ["timestamp", false],
            ["element", false],
          ],
        },
        {
          name: ELocalStorageKey.LATEST_BLOCK,
          keyPath: "contract",
          autoIncrement: false,
        },
        {
          name: ELocalStorageKey.EARNED_REWARDS,
          keyPath: "queryCID",
          autoIncrement: false,
          indexBy: [["type", false]],
        },
      ],
    });

    return this.objectStore;
  }

  private _checkAndRetrieveValue<T>(
    key: ELocalStorageKey,
    defaultVal: T,
  ): ResultAsync<T, PersistenceError> {
    return this.persistentStorageUtils.read<T>(key).map((val) => {
      return val ?? defaultVal;
    });
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this.unlockPromise);
  }

  protected waitForRestore(): ResultAsync<EVMPrivateKey, never> {
    return ResultUtils.combine<EVMPrivateKey, void, never, never>([
      ResultAsync.fromSafePromise(this.unlockPromise),
      ResultAsync.fromSafePromise(this.restorePromise),
    ]).map(([key]) => key);
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    // Store the result
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.resolveUnlock!(derivedKey);
    return this.cloudStorage
      .unlock(derivedKey)
      .andThen(() => {
        return this.pollBackups();
      })
      .map(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.resolveRestore!();
      });
  }

  private isAccountValidForChain(
    chainId: ChainId,
    account: LinkedAccount,
  ): ResultAsync<boolean, PersistenceError> {
    const targetChainInfo = getChainInfoByChainId(chainId);
    const accountChainInfo = getChainInfoByChain(account.sourceChain);
    return okAsync(
      targetChainInfo.chainTechnology == accountChainInfo.chainTechnology,
    );
  }

  public getAccounts(): ResultAsync<LinkedAccount[], PersistenceError> {
    return this.waitForRestore().andThen(() => {
      return this._getObjectStore().andThen((store) => {
        return store.getAll<LinkedAccount>(ELocalStorageKey.ACCOUNT);
      });
    });
  }

  public addEarnedReward(
    reward: EarnedReward,
  ): ResultAsync<void, PersistenceError> {
    return this.waitForUnlock().andThen((key) => {
      return this._getBackupManager().andThen((backupManager) => {
        return backupManager.addRecord(ELocalStorageKey.EARNED_REWARDS, reward);
      });
    });
  }

  public getEarnedRewards(): ResultAsync<EarnedReward[], PersistenceError> {
    return this.waitForUnlock().andThen((key) => {
      return this._getObjectStore().andThen((store) => {
        return store.getAll<EarnedReward>(ELocalStorageKey.EARNED_REWARDS);
      });
    });
  }

  public addClick(click: ClickData): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._getBackupManager().andThen((backupManager) => {
        return backupManager.addRecord(ELocalStorageKey.CLICKS, click);
      });
    });
  }

  public getClicks(): ResultAsync<ClickData[], PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._getObjectStore().andThen((store) => {
        return store.getAll<ClickData>(ELocalStorageKey.CLICKS);
      });
    });
  }

  public addRejectedCohorts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this.persistentStorageUtils
        .read<EVMContractAddress[]>(ELocalStorageKey.REJECTED_COHORTS)
        .andThen((saved) => {
          return this._getBackupManager().andThen((backupManager) => {
            return backupManager.updateField(
              ELocalStorageKey.REJECTED_COHORTS,
              [...(saved ?? []), ...consentContractAddresses],
            );
          });
        });
    });
  }

  public getRejectedCohorts(): ResultAsync<
    EVMContractAddress[],
    PersistenceError
  > {
    return this.waitForRestore().andThen(([key]) => {
      return this._checkAndRetrieveValue<EVMContractAddress[]>(
        ELocalStorageKey.REJECTED_COHORTS,
        [],
      );
    });
  }

  public addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._getBackupManager().andThen((backupManager) => {
        return ResultUtils.combine(
          siteVisits.map((visit) => {
            return backupManager.addRecord(ELocalStorageKey.SITE_VISITS, visit);
          }),
        ).map(() => {});
      });
    });
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._getObjectStore().andThen((store) => {
        return store.getAll<SiteVisit>(ELocalStorageKey.SITE_VISITS);
      });
    });
  }

  public addAccount(
    linkedAccount: LinkedAccount,
  ): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(() => {
      return this._getBackupManager().andThen((backupManager) => {
        return backupManager.addRecord(ELocalStorageKey.ACCOUNT, linkedAccount);
      });
    });
  }

  public removeAccount(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this.persistentStorageUtils
        .read<EVMAccountAddress[]>(ELocalStorageKey.ACCOUNT)
        .andThen((saved) => {
          return this._getBackupManager().andThen((backupManager) => {
            if (saved == null) {
              return okAsync(undefined);
            }

            const index = saved.indexOf(accountAddress, 0);
            if (index > -1) {
              saved.splice(index, 1);
            }

            return backupManager.updateField(ELocalStorageKey.ACCOUNT, saved);
          });
        });
    });
  }

  public setAge(age: Age): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._getBackupManager().andThen((backupManager) => {
        return backupManager.updateField(ELocalStorageKey.AGE, age);
      });
    });
  }

  public getAge(): ResultAsync<Age | null, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._checkAndRetrieveValue(ELocalStorageKey.AGE, null);
    });
  }

  public setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._getBackupManager().andThen((backupManager) => {
        return backupManager.updateField(ELocalStorageKey.FIRST_NAME, name);
      });
    });
  }

  public getGivenName(): ResultAsync<GivenName | null, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._checkAndRetrieveValue(ELocalStorageKey.FIRST_NAME, null);
    });
  }

  public setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._getBackupManager().andThen((backupManager) => {
        return backupManager.updateField(ELocalStorageKey.LAST_NAME, name);
      });
    });
  }

  public getFamilyName(): ResultAsync<FamilyName | null, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._checkAndRetrieveValue(ELocalStorageKey.LAST_NAME, null);
    });
  }

  public setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._getBackupManager().andThen((backupManager) => {
        return backupManager.updateField(ELocalStorageKey.BIRTHDAY, birthday);
      });
    });
  }

  public getBirthday(): ResultAsync<UnixTimestamp | null, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._checkAndRetrieveValue(ELocalStorageKey.BIRTHDAY, null);
    });
  }

  public setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._getBackupManager().andThen((backupManager) => {
        return backupManager.updateField(ELocalStorageKey.GENDER, gender);
      });
    });
  }

  public getGender(): ResultAsync<Gender | null, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._checkAndRetrieveValue(ELocalStorageKey.GENDER, null);
    });
  }

  public setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._getBackupManager().andThen((backupManager) => {
        return backupManager.updateField(ELocalStorageKey.EMAIL, email);
      });
    });
  }

  public getEmail(): ResultAsync<EmailAddressString | null, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._checkAndRetrieveValue(ELocalStorageKey.EMAIL, null);
    });
  }

  public setLocation(
    location: CountryCode,
  ): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._getBackupManager().andThen((backupManager) => {
        return backupManager.updateField(ELocalStorageKey.LOCATION, location);
      });
    });
  }

  public getLocation(): ResultAsync<CountryCode | null, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._checkAndRetrieveValue(ELocalStorageKey.LOCATION, null);
    });
  }

  public updateAccountBalances(
    balances: TokenBalance[],
  ): ResultAsync<TokenBalance[], PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this.persistentStorageUtils
        .write(ELocalStorageKey.BALANCES, JSON.stringify(balances))
        .andThen(() => {
          return this.persistentStorageUtils
            .write(ELocalStorageKey.BALANCES_LAST_UPDATE, new Date().getTime())
            .andThen(() => {
              return okAsync(balances);
            });
        });
    });
  }

  public getAccountBalances(): ResultAsync<TokenBalance[], PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return ResultUtils.combine([
        this.configProvider.getConfig(),
        this._checkAndRetrieveValue<number>(
          ELocalStorageKey.BALANCES_LAST_UPDATE,
          0,
        ),
      ]).andThen(([config, lastUpdate]) => {
        const currTime = new Date().getTime();
        if (currTime - lastUpdate < config.accountBalancePollingIntervalMS) {
          return this._checkAndRetrieveValue<TokenBalance[]>(
            ELocalStorageKey.BALANCES,
            [],
          );
        }

        return this.pollBalances().mapErr(
          (e) => new PersistenceError(`${e.name}: ${e.message}`),
        );
      });
    });
  }

  private pollBalances(): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError
  > {
    return ResultUtils.combine([
      this.getAccounts(),
      this.configProvider.getConfig(),
    ])
      .andThen(([linkedAccounts, config]) => {
        // Limit it to only EVM linked accounts
        const evmAccounts = linkedAccounts.filter((la) => {
          // Get the chainInfo for the linked account
          const chainInfo = getChainInfoByChain(la.sourceChain);
          return chainInfo.chainTechnology == EChainTechnology.EVM;
        });

        return ResultUtils.combine(
          evmAccounts.map((linkedAccount) => {
            return ResultUtils.combine(
              config.supportedChains.map((chainId) => {
                return this.getLatestBalances(
                  chainId,
                  linkedAccount.sourceAccountAddress as EVMAccountAddress,
                );
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
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.accountBalances.getEVMBalanceRepository(),
      this.accountBalances.getSolanaBalanceRepository(),
      this.accountBalances.getSimulatorEVMBalanceRepository(),
    ]).andThen(([config, evmRepo, solRepo, simulatorRepo]) => {
      const chainInfo = config.chainInformation.get(chainId);
      if (chainInfo == null) {
        return errAsync(
          new AccountIndexingError(
            `No available chain info for chain ${chainId}`,
          ),
        );
      }

      switch (chainInfo.indexer) {
        case EIndexer.EVM:
          return evmRepo.getBalancesForAccount(chainId, accountAddress as EVMAccountAddress);
        case EIndexer.Simulator:
          return simulatorRepo.getBalancesForAccount(chainId, accountAddress as EVMAccountAddress);
        case EIndexer.Solana:
          return solRepo.getBalancesForAccount(chainId, accountAddress as SolanaAccountAddress);
        default:
          return errAsync(
            new AccountIndexingError(
              `No available balance repository for chain ${chainId}`,
            ),
          );
      }
    });
  }

  public updateAccountNFTs(
    nfts: IAccountNFT[],
  ): ResultAsync<IAccountNFT[], PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this.persistentStorageUtils
        .write(ELocalStorageKey.NFTS, JSON.stringify(nfts))
        .andThen(() => {
          return this.persistentStorageUtils
            .write(ELocalStorageKey.NFTS_LAST_UPDATE, new Date().getTime())
            .andThen(() => {
              return okAsync(nfts);
            });
        });
    });
  }

  public getAccountNFTs(): ResultAsync<IAccountNFT[], PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return ResultUtils.combine([
        this.configProvider.getConfig(),
        this._checkAndRetrieveValue<number>(
          ELocalStorageKey.NFTS_LAST_UPDATE,
          0,
        ),
      ]).andThen(([config, lastUpdate]) => {
        const currTime = new Date().getTime();
        if (currTime - lastUpdate < config.accountNFTPollingIntervalMS) {
          return this._checkAndRetrieveValue<IAccountNFT[]>(
            ELocalStorageKey.NFTS,
            [],
          );
        }

        return this.pollNFTs().mapErr(
          (e) => new PersistenceError(`${e.name}: ${e.message}`),
        );
      });
    });
  }

  private pollNFTs(): ResultAsync<
    IAccountNFT[],
    PersistenceError | AjaxError | AccountIndexingError
  > {
    return ResultUtils.combine([
      this.getAccounts(),
      this.configProvider.getConfig(),
    ])
      .andThen(([linkedAccounts, config]) => {
        return ResultUtils.combine(
          linkedAccounts.map((linkedAccount) => {
            return ResultUtils.combine(
              config.supportedChains.map((chainId) => {
                return this.getLatestNFTs(
                  chainId,
                  linkedAccount.sourceAccountAddress,
                );
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
    accountAddress: AccountAddress,
  ): ResultAsync<IAccountNFT[], PersistenceError | AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.accountNFTs.getEVMNftRepository(),
      this.accountNFTs.getSolanaNFTRepository(),
      this.accountNFTs.getSimulatorEVMNftRepository(),
    ]).andThen(([config, evmRepo, solRepo, simulatorRepo]) => {
      const chainInfo = config.chainInformation.get(chainId);
      if (chainInfo == null) {
        return errAsync(
          new AccountIndexingError(`No available chain info for chain ${chainId}`),
        );
      }

      switch (chainInfo.indexer) {
        case EIndexer.EVM:
          return evmRepo.getTokensForAccount(chainId, accountAddress as EVMAccountAddress);
        case EIndexer.Simulator:
          return simulatorRepo.getTokensForAccount(chainId, accountAddress as EVMAccountAddress);
        case EIndexer.Solana:
          return solRepo.getTokensForAccount(chainId, accountAddress as SolanaAccountAddress);
        default:
          return errAsync(
            new AccountIndexingError(
              `No available token repository for chain ${chainId}`,
            ),
          );
      }
    });
  }

  public getTransactionsArray(): ResultAsync<
    IChainTransaction[],
    PersistenceError
  > {
    return okAsync([]);
  }

  public addTransactions(
    transactions: IChainTransaction[],
  ): ResultAsync<void, PersistenceError> {
    if (transactions.length == 0) {
      return okAsync(undefined);
    }

    return this.waitForRestore().andThen(([key]) => {
      return this._getBackupManager().andThen((backupManager) => {
        return ResultUtils.combine(
          transactions.map((tx) => {
            return backupManager.addRecord(ELocalStorageKey.TRANSACTIONS, tx);
          }),
        ).andThen(() => okAsync(undefined));
      });
    });
  }

  public getTransactions(
    filter?: TransactionFilter,
  ): ResultAsync<IChainTransaction[], PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._getObjectStore().andThen((txStore) => {
        return txStore
          .getAll<EVMTransaction>(ELocalStorageKey.TRANSACTIONS)
          .andThen((transactions) => {
            if (filter == undefined) {
              return okAsync(transactions);
            }

            return okAsync(
              transactions.filter((value) => filter.matches(value)),
            );
          });
      });
    });
  }

  public getLatestTransactionForAccount(
    chainId: ChainId,
    address: AccountAddress,
  ): ResultAsync<EVMTransaction | null, PersistenceError> {
    // TODO: add multikey support to cursor function
    return this.waitForRestore().andThen(([key]) => {
      const filter = new TransactionFilter([chainId], [address]);
      return this._getObjectStore().andThen((txStore) => {
        return txStore
          .getCursor<EVMTransaction>(
            ELocalStorageKey.TRANSACTIONS,
            "timestamp",
            undefined,
            "prev",
          )
          .andThen((cursor) => this._getNextMatchingTx(cursor, filter));
      });
    });
  }

  private _getNextMatchingTx(
    cursor: IVolatileCursor<EVMTransaction>,
    filter: TransactionFilter,
  ): ResultAsync<EVMTransaction | null, PersistenceError> {
    return cursor.nextValue().andThen((val) => {
      if (!val || filter.matches(val)) {
        return okAsync(val);
      }
      return this._getNextMatchingTx(cursor, filter);
    });
  }

  // return a map of URLs
  public getSiteVisitsMap(): ResultAsync<
    Map<URLString, number>,
    PersistenceError
  > {
    return this.waitForRestore().andThen(([key]) => {
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
    });
  }

  public getTransactionsMap(): ResultAsync<
    Map<ChainId, number>,
    PersistenceError
  > {
    return this.waitForRestore().andThen(([key]) => {
      return ResultUtils.combine([
        this.configProvider.getConfig(),
        this._getObjectStore(),
      ])
        .andThen(([config, txStore]) => {
          const chains = Array.from(config.chainInformation.keys());
          return ResultUtils.combine(
            chains.map((chain) => {
              return txStore
                .getAllKeys(ELocalStorageKey.TRANSACTIONS, "chainId", chain)
                .andThen((keys) => {
                  return okAsync([chain, keys.length]);
                });
            }),
          );
        })
        .andThen((result) => {
          const returnVal = new Map<ChainId, number>();
          result.forEach((elem) => {
            const [chain, num] = elem;
            returnVal[chain] = num;
          });
          return okAsync(returnVal);
        });
    });
  }

  public setLatestBlockNumber(
    contractAddress: EVMContractAddress,
    blockNumber: BlockNumber,
  ): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._getBackupManager().andThen((backupManager) => {
        return backupManager.addRecord(ELocalStorageKey.LATEST_BLOCK, {
          contract: contractAddress,
          block: blockNumber,
        });
      });
    });
  }

  public getLatestBlockNumber(
    contractAddress: EVMContractAddress,
  ): ResultAsync<BlockNumber, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._getObjectStore().andThen((store) => {
        return store
          .getObject<LatestBlockEntry>(
            ELocalStorageKey.LATEST_BLOCK,
            contractAddress.toString(),
          )
          .map((block) => {
            if (block == null) {
              return BlockNumber(-1);
            }
            return block.block;
          });
      });
    });
  }

  public dumpBackup(): ResultAsync<IDataWalletBackup, PersistenceError> {
    return this._getBackupManager().andThen((backupManager) =>
      backupManager.dump(),
    );
  }

  public restoreBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    return this._getBackupManager().andThen((backupManager) => {
      return backupManager.restore(backup).orElse((err) => {
        this.logUtils.warning(
          "Error restoring backups! Data wallet will likely have incomplete data!",
          err,
        );
        return okAsync(undefined);
      });
    });
  }

  public pollBackups(): ResultAsync<void, PersistenceError> {
    return this.cloudStorage
      .pollBackups()
      .andThen((backups) => {
        return ResultUtils.combine(
          backups.map((backup) => {
            return this.restoreBackup(backup);
          }),
        );
      })
      .andThen(() => {
        return ResultUtils.combine([
          this._getBackupManager(),
          this.configProvider.getConfig(),
        ]).andThen(([backupManager, config]) => {
          return backupManager.getNumUpdates().andThen((numUpdates) => {
            // console.log("chunk", numUpdates, config.backupChunkSizeTarget);
            if (numUpdates >= config.backupChunkSizeTarget) {
              return backupManager.dump().andThen((backup) => {
                return this.cloudStorage
                  .putBackup(backup)
                  .andThen(() => okAsync(backupManager.clear()));
              });
            }
            return okAsync(undefined);
          });
        });
      });
  }

  // rename this. its bad.
  public returnProperTransactions(): ResultAsync<
    IChainTransaction[],
    PersistenceError
  > {
    const chainlist: IChainTransaction[] = [];
    return okAsync(chainlist);
  }

  public postBackup(): ResultAsync<CeramicStreamID, PersistenceError> {
    return ResultUtils.combine([
      this.waitForRestore(),
      this._getBackupManager(),
    ]).andThen(([key, backupManager]) => {
      return backupManager.dump().andThen((backup) => {
        return this.cloudStorage.putBackup(backup).andThen((id) => {
          backupManager.clear();
          return okAsync(id);
        });
      });
    });
  }

  public clearCloudStore(): ResultAsync<void, PersistenceError> {
    return this.cloudStorage.clear();
  }
}
