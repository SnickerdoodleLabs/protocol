import {
  ICryptoUtils,
  ICryptoUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  URLString,
  DomainName,
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
  ChainId,
  BlockNumber,
  IAccountBalances,
  IAccountBalancesType,
  IAccountNFTs,
  IAccountNFTsType,
  AjaxError,
  EIndexer,
  IDataWalletBackup,
  LinkedAccount,
  getChainInfoByChain,
  ChainTransaction,
  EarnedReward,
  Invitation,
  Signature,
  TokenId,
  chainConfig,
  TokenBalance,
  WalletNFT,
  AccountIndexingError,
  isAccountValidForChain,
  AccountAddress,
  SolanaAccountAddress,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  TokenAddress,
  TransactionFilter,
  PortfolioUpdate,
  DataWalletBackupID,
  JSONString,
} from "@snickerdoodlelabs/objects";
import {
  IBackupManagerProvider,
  IBackupManagerProviderType,
  ICloudStorage,
  ICloudStorageType,
  ELocalStorageKey,
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
  IVolatileStorage,
  IVolatileCursor,
  IVolatileStorageType,
  PortfolioCache,
} from "@snickerdoodlelabs/persistence";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { parse } from "tldts";

import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class DataWalletPersistence implements IDataWalletPersistence {
  private unlockPromise: Promise<EVMPrivateKey>;
  private resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null = null;

  private restorePromise: Promise<void>;
  private resolveRestore: (() => void) | null = null;

  private _balanceCache?: ResultAsync<
    PortfolioCache<
      TokenBalance[],
      PersistenceError | AccountIndexingError | AjaxError
    >,
    never
  >;
  private _nftCache?: ResultAsync<
    PortfolioCache<
      WalletNFT[],
      PersistenceError | AccountIndexingError | AjaxError
    >,
    never
  >;

  public constructor(
    @inject(IAccountNFTsType)
    protected accountNFTs: IAccountNFTs,
    @inject(IAccountBalancesType) protected accountBalances: IAccountBalances,
    @inject(IBackupManagerProviderType)
    protected backupManagerProvider: IBackupManagerProvider,
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
    @inject(IVolatileStorageType)
    protected volatileStorage: IVolatileStorage,
    @inject(ICloudStorageType) protected cloudStorage: ICloudStorage,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {
    this.unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this.resolveUnlock = resolve;
    });
    this.restorePromise = new Promise<void>((resolve) => {
      this.resolveRestore = resolve;
    });

    // reset portfolio cache on account addition and removal
    this.contextProvider.getContext().map((context) => {
      context.publicEvents.onAccountAdded.subscribe((account) =>
        this._clearPortfolioCaches(account),
      );
      context.publicEvents.onAccountRemoved.subscribe((account) =>
        this._clearPortfolioCaches(account),
      );
    });
  }

  public getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp: UnixTimestamp,
  ): ResultAsync<number, PersistenceError> {
    return this.tokenPriceRepo
      .getTokenPrice(chainId, address, timestamp)
      .mapErr((e) => new PersistenceError("unable to fetch token price", e));
  }

  private _checkAndRetrieveValue<T>(
    key: ELocalStorageKey,
    defaultVal: T,
  ): ResultAsync<T, PersistenceError> {
    return this.storageUtils.read<T>(key).map((val) => {
      return val ?? defaultVal;
    });
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this.unlockPromise);
  }

  public waitForRestore(): ResultAsync<EVMPrivateKey, never> {
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
    return ResultUtils.combine([
      this.cloudStorage.unlock(derivedKey),
      this.backupManagerProvider.unlock(derivedKey),
    ])
      .map(() => {
        this.configProvider.getConfig().map((config) => {
          const timeout = setTimeout(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            () => this.resolveRestore!(),
            config.restoreTimeoutMS,
          );
          this.pollBackups().map(() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.resolveRestore!();
            clearTimeout(timeout);
          });
        });
      })
      .mapErr((e) => new PersistenceError("error unlocking data wallet", e));
  }

  public getAccounts(): ResultAsync<LinkedAccount[], PersistenceError> {
    return this.waitForRestore().andThen((store) => {
      return this.volatileStorage.getAll<LinkedAccount>(
        ELocalStorageKey.ACCOUNT,
      );
    });
  }

  public getAcceptedInvitations(): ResultAsync<Invitation[], PersistenceError> {
    return this.waitForRestore()
      .andThen(() => {
        return this._checkAndRetrieveValue<JSONString>(
          ELocalStorageKey.ACCEPTED_INVITATIONS,
          JSONString("[]"),
        );
      })
      .map((json) => {
        const storedInvitations = JSON.parse(json) as InvitationForStorage[];
        return storedInvitations.map((storedInvitation) => {
          return InvitationForStorage.toInvitation(storedInvitation);
        });
      });
  }

  public addAcceptedInvitations(
    invitations: Invitation[],
  ): ResultAsync<void, PersistenceError> {
    return this.waitForRestore()
      .andThen(() => {
        return ResultUtils.combine([
          this.backupManagerProvider.getBackupManager(),
          this._checkAndRetrieveValue<JSONString>(
            ELocalStorageKey.ACCEPTED_INVITATIONS,
            JSONString("[]"),
          ),
        ]);
      })
      .andThen(([backupManager, json]) => {
        const storedInvitations = JSON.parse(json) as InvitationForStorage[];

        // Convert and add the new invitations
        const allInvitations = storedInvitations.concat(
          invitations.map((invitation) => {
            return InvitationForStorage.fromInvitation(invitation);
          }),
        );

        return backupManager.updateField(
          ELocalStorageKey.ACCEPTED_INVITATIONS,
          JSONString(JSON.stringify(allInvitations)),
        );
      });
  }

  public removeAcceptedInvitationsByContractAddress(
    addressesToRemove: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    return this.waitForRestore()
      .andThen(() => {
        return ResultUtils.combine([
          this.backupManagerProvider.getBackupManager(),
          this._checkAndRetrieveValue<JSONString>(
            ELocalStorageKey.ACCEPTED_INVITATIONS,
            JSONString("[]"),
          ),
        ]);
      })
      .andThen(([backupManager, json]) => {
        const storedInvitations = JSON.parse(json) as InvitationForStorage[];

        const invitations = storedInvitations.filter((optIn) => {
          return !addressesToRemove.includes(optIn.consentContractAddress);
        });

        return backupManager.updateField(
          ELocalStorageKey.ACCEPTED_INVITATIONS,
          JSONString(JSON.stringify(invitations)),
        );
      });
  }

  public addEarnedRewards(
    rewards: EarnedReward[],
  ): ResultAsync<void, PersistenceError> {
    return this.waitForUnlock()
      .andThen(() => {
        return this.backupManagerProvider
          .getBackupManager()
          .andThen((backupManager) => {
            return ResultUtils.combine(
              rewards.map((reward) => {
                return backupManager.addRecord(
                  ELocalStorageKey.EARNED_REWARDS,
                  reward,
                );
              }),
            ).map(() => undefined);
          });
      })
      .map(() => {});
  }

  public getEarnedRewards(): ResultAsync<EarnedReward[], PersistenceError> {
    return this.waitForUnlock().andThen(() => {
      return this.volatileStorage.getAll<EarnedReward>(
        ELocalStorageKey.EARNED_REWARDS,
      );
    });
  }

  public addClick(click: ClickData): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this.backupManagerProvider
        .getBackupManager()
        .andThen((backupManager) => {
          return backupManager.addRecord(ELocalStorageKey.CLICKS, click);
        });
    });
  }

  public getClicks(): ResultAsync<ClickData[], PersistenceError> {
    return this.waitForRestore().andThen(() => {
      return this.volatileStorage.getAll<ClickData>(ELocalStorageKey.CLICKS);
    });
  }

  public addRejectedCohorts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this.storageUtils
        .read<EVMContractAddress[]>(ELocalStorageKey.REJECTED_COHORTS)
        .andThen((saved) => {
          return this.backupManagerProvider
            .getBackupManager()
            .andThen((backupManager) => {
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
      return this.backupManagerProvider
        .getBackupManager()
        .andThen((backupManager) => {
          return ResultUtils.combine(
            siteVisits.map((visit: SiteVisit) => {
              const url = parse(visit.url);
              visit.domain = url.domain ? DomainName(url.domain) : undefined;
              return backupManager.addRecord(
                ELocalStorageKey.SITE_VISITS,
                visit,
              );
            }),
          ).map(() => {});
        });
    });
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this.volatileStorage.getAll<SiteVisit>(
        ELocalStorageKey.SITE_VISITS,
      );
    });
  }

  public addAccount(
    linkedAccount: LinkedAccount,
  ): ResultAsync<void, PersistenceError> {
    return this.waitForRestore()
      .andThen(() => {
        return this.backupManagerProvider.getBackupManager();
      })
      .andThen((backupManager) => {
        return backupManager.addRecord(ELocalStorageKey.ACCOUNT, linkedAccount);
      });
  }

  public removeAccount(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<void, PersistenceError> {
    return this.waitForRestore()
      .andThen(() => {
        return this.storageUtils.read<EVMAccountAddress[]>(
          ELocalStorageKey.ACCOUNT,
        );
      })
      .andThen((saved) => {
        return this.backupManagerProvider
          .getBackupManager()
          .andThen((backupManager) => {
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
  }

  public setAge(age: Age): ResultAsync<void, PersistenceError> {
    return this.waitForRestore()
      .andThen(() => {
        return this.backupManagerProvider.getBackupManager();
      })
      .andThen((backupManager) => {
        return backupManager.updateField(ELocalStorageKey.AGE, age);
      });
  }

  public getAge(): ResultAsync<Age | null, PersistenceError> {
    return this.waitForRestore().andThen(() => {
      return this._checkAndRetrieveValue(ELocalStorageKey.AGE, null);
    });
  }

  public setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    return this.waitForRestore()
      .andThen(() => {
        return this.backupManagerProvider.getBackupManager();
      })
      .andThen((backupManager) => {
        return backupManager.updateField(ELocalStorageKey.FIRST_NAME, name);
      });
  }

  public getGivenName(): ResultAsync<GivenName | null, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._checkAndRetrieveValue(ELocalStorageKey.FIRST_NAME, null);
    });
  }

  public setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    return this.waitForRestore()
      .andThen(() => {
        return this.backupManagerProvider.getBackupManager();
      })
      .andThen((backupManager) => {
        return backupManager.updateField(ELocalStorageKey.LAST_NAME, name);
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
    return this.waitForRestore()
      .andThen(() => {
        return this.backupManagerProvider.getBackupManager();
      })
      .andThen((backupManager) => {
        return backupManager.updateField(ELocalStorageKey.BIRTHDAY, birthday);
      });
  }

  public getBirthday(): ResultAsync<UnixTimestamp | null, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._checkAndRetrieveValue(ELocalStorageKey.BIRTHDAY, null);
    });
  }

  public setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    return this.waitForRestore()
      .andThen(() => {
        return this.backupManagerProvider.getBackupManager();
      })
      .andThen((backupManager) => {
        return backupManager.updateField(ELocalStorageKey.GENDER, gender);
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
    return this.waitForRestore()
      .andThen(() => {
        return this.backupManagerProvider.getBackupManager();
      })
      .andThen((backupManager) => {
        return backupManager.updateField(ELocalStorageKey.EMAIL, email);
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
    return this.waitForRestore()
      .andThen(() => {
        return this.backupManagerProvider.getBackupManager();
      })
      .andThen((backupManager) => {
        return backupManager.updateField(ELocalStorageKey.LOCATION, location);
      });
  }

  public getLocation(): ResultAsync<CountryCode | null, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this._checkAndRetrieveValue(ELocalStorageKey.LOCATION, null);
    });
  }

  public getAccountBalances(
    chains?: ChainId[],
    accounts?: LinkedAccount[],
  ): ResultAsync<TokenBalance[], PersistenceError> {
    return ResultUtils.combine([
      this.getAccounts(),
      this.configProvider.getConfig(),
    ])
      .andThen(([linkedAccounts, config]) => {
        return ResultUtils.combine(
          (accounts ?? linkedAccounts).map((linkedAccount) => {
            return ResultUtils.combine(
              (chains ?? config.supportedChains).map((chainId) => {
                if (!isAccountValidForChain(chainId, linkedAccount)) {
                  return okAsync([]);
                }

                return this.getCachedBalances(
                  chainId,
                  linkedAccount.sourceAccountAddress as EVMAccountAddress,
                );
              }),
            );
          }),
        );
      })
      .map((balancesArr) => {
        return balancesArr.flat(2);
      })
      .mapErr((e) => new PersistenceError("error aggregating balances", e));
  }

  private getCachedBalances(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError
  > {
    return ResultUtils.combine([
      this._getBalanceCache(),
      this.contextProvider.getContext(),
    ]).andThen(([cache, context]) => {
      return cache.get(chainId, accountAddress).andThen((cacheResult) => {
        if (cacheResult != null) {
          return okAsync(cacheResult);
        }
        const fetch = this.getLatestBalances(chainId, accountAddress).map(
          (result) => {
            context.publicEvents.onTokenBalanceUpdate.next(
              new PortfolioUpdate(
                accountAddress,
                chainId,
                new Date().getTime(),
                result,
              ),
            );
            return result;
          },
        );
        return cache
          .set(chainId, accountAddress, new Date().getTime(), fetch)
          .andThen(() => fetch);
      });
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
      this.accountBalances.getEthereumBalanceRepository(),
      this.accountBalances.getPolygonBalanceRepository(),
    ])
      .andThen(
        ([
          config,
          evmRepo,
          solRepo,
          simulatorRepo,
          etherscanRepo,
          maticRepo,
        ]) => {
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
            case EIndexer.Polygon:
              return evmRepo.getBalancesForAccount(
                chainId,
                accountAddress as EVMAccountAddress,
              );
            case EIndexer.Simulator:
              return simulatorRepo.getBalancesForAccount(
                chainId,
                accountAddress as EVMAccountAddress,
              );
            case EIndexer.Solana:
              return solRepo.getBalancesForAccount(
                chainId,
                accountAddress as SolanaAccountAddress,
              );
            case EIndexer.Ethereum:
              return etherscanRepo.getBalancesForAccount(
                chainId,
                accountAddress as EVMAccountAddress,
              );
            default:
              return errAsync(
                new AccountIndexingError(
                  `No available balance repository for chain ${chainId}`,
                ),
              );
          }
        },
      )
      .orElse((e) => {
        this.logUtils.error(
          "error fetching balances",
          chainId,
          accountAddress,
          e,
        );
        return okAsync([]);
      });
  }

  public getAccountNFTs(
    chains?: ChainId[],
    accounts?: LinkedAccount[],
  ): ResultAsync<WalletNFT[], PersistenceError> {
    return ResultUtils.combine([
      this.getAccounts(),
      this.configProvider.getConfig(),
    ])
      .andThen(([linkedAccounts, config]) => {
        return ResultUtils.combine(
          (accounts ?? linkedAccounts).map((linkedAccount) => {
            return ResultUtils.combine(
              (chains ?? config.supportedChains).map((chainId) => {
                if (!isAccountValidForChain(chainId, linkedAccount)) {
                  return okAsync([]);
                }

                return this.getCachedNFTs(
                  chainId,
                  linkedAccount.sourceAccountAddress,
                );
              }),
            );
          }),
        );
      })
      .map((nftArr) => {
        return nftArr.flat(2);
      })
      .mapErr((e) => new PersistenceError("error aggregating nfts", e));
  }

  private getCachedNFTs(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    PersistenceError | AjaxError | AccountIndexingError
  > {
    return ResultUtils.combine([
      this._getNftCache(),
      this.contextProvider.getContext(),
    ]).andThen(([cache, context]) => {
      return cache.get(chainId, accountAddress).andThen((cacheResult) => {
        if (cacheResult != null) {
          return okAsync(cacheResult);
        }
        const fetch = this.getLatestNFTs(chainId, accountAddress).map(
          (result) => {
            context.publicEvents.onNftBalanceUpdate.next(
              new PortfolioUpdate(
                accountAddress,
                chainId,
                new Date().getTime(),
                result,
              ),
            );
            return result;
          },
        );
        return cache
          .set(chainId, accountAddress, new Date().getTime(), fetch)
          .andThen(() => fetch);
      });
    });
  }

  private getLatestNFTs(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    PersistenceError | AccountIndexingError | AjaxError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.accountNFTs.getEVMNftRepository(),
      this.accountNFTs.getSolanaNFTRepository(),
      this.accountNFTs.getSimulatorEVMNftRepository(),
      this.accountNFTs.getEthereumNftRepository(),
    ])
      .andThen(([config, evmRepo, solRepo, simulatorRepo, etherscanRepo]) => {
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
          case EIndexer.Polygon:
            return evmRepo.getTokensForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Simulator:
            return simulatorRepo.getTokensForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          case EIndexer.Solana:
            return solRepo.getTokensForAccount(
              chainId,
              accountAddress as SolanaAccountAddress,
            );
          case EIndexer.Ethereum:
            return etherscanRepo.getTokensForAccount(
              chainId,
              accountAddress as EVMAccountAddress,
            );
          default:
            return errAsync(
              new AccountIndexingError(
                `No available token repository for chain ${chainId}`,
              ),
            );
        }
      })
      .orElse((e) => {
        this.logUtils.error("error fetching nfts", chainId, accountAddress, e);
        return okAsync([]);
      });
  }

  public getTransactionsArray(): ResultAsync<
    ChainTransaction[],
    PersistenceError
  > {
    return okAsync([]);
  }

  public addTransactions(
    transactions: ChainTransaction[],
  ): ResultAsync<void, PersistenceError> {
    if (transactions.length == 0) {
      return okAsync(undefined);
    }

    return this.waitForRestore().andThen(([key]) => {
      return this.backupManagerProvider
        .getBackupManager()
        .andThen((backupManager) => {
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
  ): ResultAsync<ChainTransaction[], PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this.volatileStorage
        .getAll<ChainTransaction>(ELocalStorageKey.TRANSACTIONS)
        .andThen((transactions) => {
          if (filter == undefined) {
            return okAsync(transactions);
          }

          return okAsync(transactions.filter((value) => filter.matches(value)));
        });
    });
  }

  public getLatestTransactionForAccount(
    chainId: ChainId,
    address: AccountAddress,
  ): ResultAsync<ChainTransaction | null, PersistenceError> {
    // TODO: add multikey support to cursor function
    return this.waitForRestore().andThen(([key]) => {
      const filter = new TransactionFilter([chainId], [address]);
      return this.volatileStorage
        .getCursor<ChainTransaction>(
          ELocalStorageKey.TRANSACTIONS,
          "timestamp",
          undefined,
          "prev",
        )
        .andThen((cursor) => this._getNextMatchingTx(cursor, filter));
    });
  }

  private _getNextMatchingTx(
    cursor: IVolatileCursor<ChainTransaction>,
    filter: TransactionFilter,
  ): ResultAsync<ChainTransaction | null, PersistenceError> {
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
          const baseUrl = DomainName(
            siteVisit.domain ? siteVisit.domain : siteVisit.url,
          );
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
    return this.waitForRestore()
      .andThen(() => {
        const chains = Array.from(chainConfig.keys());
        return ResultUtils.combine(
          chains.map((chain) => {
            return this.volatileStorage
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
  }

  public setLatestBlockNumber(
    contractAddress: EVMContractAddress,
    blockNumber: BlockNumber,
  ): ResultAsync<void, PersistenceError> {
    return this.waitForRestore().andThen(([key]) => {
      return this.backupManagerProvider
        .getBackupManager()
        .andThen((backupManager) => {
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
    return this.waitForRestore().andThen(() => {
      return this.volatileStorage
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
  }

  public restoreBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
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
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return backupManager.getRestored();
      })
      .andThen((restored) => {
        return this.cloudStorage
          .pollBackups(restored)
          .andThen((backups) => {
            return ResultUtils.combine(
              backups.map((backup) => {
                return this.restoreBackup(backup);
              }),
            );
          })
          .andThen(() => {
            return this.postBackups().map(() => undefined);
          })
          .orElse((e) => {
            this.logUtils.error("error loading backups", e);
            return okAsync(undefined);
          });
      });
  }

  public postBackups(): ResultAsync<DataWalletBackupID[], PersistenceError> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return backupManager.popBackup().andThen((backup) => {
          if (backup == undefined) {
            return okAsync([]);
          }

          return this.cloudStorage.putBackup(backup).andThen((streamID) => {
            return this.postBackups().map((ids) => {
              return [streamID, ...ids];
            });
          });
        });
      });
  }

  // rename this. its bad.
  public returnProperTransactions(): ResultAsync<
    ChainTransaction[],
    PersistenceError
  > {
    const chainlist: ChainTransaction[] = [];
    return okAsync(chainlist);
  }

  public clearCloudStore(): ResultAsync<void, PersistenceError> {
    return this.cloudStorage.clear().mapErr((error) => {
      return new PersistenceError((error as Error).message, error);
    });
  }

  private _clearPortfolioCaches(
    account: LinkedAccount,
  ): ResultAsync<void, never> {
    return ResultUtils.combine([this._getBalanceCache(), this._getNftCache()])
      .andThen(([balanceCache, nftCache]) => {
        const results = new Array<ResultAsync<void, never>>();
        chainConfig.forEach((_, chainId) => {
          if (isAccountValidForChain(chainId, account)) {
            results.push(
              balanceCache.clear(chainId, account.sourceAccountAddress),
            );
            results.push(nftCache.clear(chainId, account.sourceAccountAddress));
          }
        });
        return ResultUtils.combine(results);
      })
      .map(() => undefined);
  }

  private _getBalanceCache(): ResultAsync<
    PortfolioCache<
      TokenBalance[],
      PersistenceError | AccountIndexingError | AjaxError
    >,
    never
  > {
    if (this._balanceCache) {
      return this._balanceCache;
    }

    this._balanceCache = this.configProvider.getConfig().andThen((config) => {
      return okAsync(
        new PortfolioCache<
          TokenBalance[],
          PersistenceError | AccountIndexingError | AjaxError
        >(config.accountBalancePollingIntervalMS),
      );
    });
    return this._balanceCache;
  }

  private _getNftCache(): ResultAsync<
    PortfolioCache<
      WalletNFT[],
      PersistenceError | AccountIndexingError | AjaxError
    >,
    never
  > {
    if (this._nftCache) {
      return this._nftCache;
    }

    this._nftCache = this.configProvider.getConfig().andThen((config) => {
      return okAsync(
        new PortfolioCache<
          WalletNFT[],
          PersistenceError | AccountIndexingError | AjaxError
        >(config.accountNFTPollingIntervalMS),
      );
    });
    return this._nftCache;
  }
}

class InvitationForStorage {
  public constructor(
    public domain: DomainName,
    public consentContractAddress: EVMContractAddress,
    public tokenId: string,
    public businessSignature: Signature | null,
  ) {}

  static toInvitation(src: InvitationForStorage): Invitation {
    return new Invitation(
      src.domain,
      src.consentContractAddress,
      TokenId(BigInt(src.tokenId)),
      src.businessSignature,
    );
  }

  static fromInvitation(src: Invitation): InvitationForStorage {
    return new InvitationForStorage(
      src.domain,
      src.consentContractAddress,
      src.tokenId.toString(),
      src.businessSignature,
    );
  }
}

interface LatestBlockEntry {
  contract: EVMContractAddress;
  block: BlockNumber;
}
