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
  EVMTransaction,
  ChainId,
  IEVMBalance,
  IEVMNFT,
  EVMTransactionFilter,
  BlockNumber,
  IAccountBalances,
  IAccountBalancesType,
  IAccountNFTs,
  IAccountNFTsType,
  AccountNFTError,
  AjaxError,
  EIndexer,
  AccountBalanceError,
  IDataWalletBackup,
  BigNumberString,
  LinkedAccount,
  EChainTechnology,
  getChainInfoByChain,
  IChainTransaction,
  ChainTransaction,
  EarnedReward,
  Invitation,
  Signature,
  TokenId,
  chainConfig,
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
} from "@snickerdoodlelabs/persistence";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { BigNumber } from "ethers";
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

  private _balances?: ResultAsync<IEVMBalance[], PersistenceError>;
  private _lastBalanceUpdate = 0;

  private _nfts?: ResultAsync<IEVMNFT[], PersistenceError>;
  private _lastNftUpdate = 0;

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
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {
    this.unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this.resolveUnlock = resolve;
    });
    this.restorePromise = new Promise<void>((resolve) => {
      this.resolveRestore = () => {
        this.contextProvider.getContext().map((ctx) => {
          ctx.publicEvents.onInitialRestore.next(null);
        });
        resolve();
      };
    });
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

  protected waitForRestore(): ResultAsync<EVMPrivateKey, never> {
    return ResultUtils.combine<EVMPrivateKey, void, never, never>([
      ResultAsync.fromSafePromise(this.unlockPromise),
      ResultAsync.fromSafePromise(this.restorePromise),
    ]).map(([key]) => key);
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError | AjaxError> {
    // Store the result
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.resolveUnlock!(derivedKey);
    return ResultUtils.combine([
      this.cloudStorage.unlock(derivedKey),
      this.backupManagerProvider.unlock(derivedKey),
    ])
      .andThen(() => {
        return this.pollBackups();
      })
      .map(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.resolveRestore!();
      });
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

  public getAccountBalances(): ResultAsync<IEVMBalance[], PersistenceError> {
    return ResultUtils.combine([
      this.waitForRestore(),
      this.configProvider.getConfig(),
    ]).andThen(([key, config]) => {
      const currTime = new Date().getTime();
      if (
        this._balances != undefined &&
        currTime - this._lastBalanceUpdate <
          config.accountBalancePollingIntervalMS
      ) {
        return this._balances;
      }
      this._balances = this.pollBalances().mapErr(
        (e) => new PersistenceError(`${e.name}: ${e.message}`),
      );
      this._lastBalanceUpdate = currTime;
      return this._balances;
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
      .map((balancesArr) => {
        return balancesArr.flat(2);
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
      this.accountBalances.getEVMBalanceRepository(),
      this.accountBalances.getSimulatorEVMBalanceRepository(),
    ]).andThen(([evmRepo, simulatorRepo]) => {
      const chainInfo = chainConfig.get(chainId);
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

  public getAccountNFTs(): ResultAsync<IEVMNFT[], PersistenceError> {
    return ResultUtils.combine([
      this.waitForRestore(),
      this.configProvider.getConfig(),
    ]).andThen(([key, config]) => {
      const currTime = new Date().getTime();
      if (
        this._nfts != undefined &&
        currTime - this._lastNftUpdate < config.accountNFTPollingIntervalMS
      ) {
        return this._nfts;
      }
      this._nfts = this.pollNFTs().mapErr(
        (e) => new PersistenceError("error fetching NFTs", e),
      );
      this._lastNftUpdate = currTime;
      return this._nfts;
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
                return this.getLatestNFTs(
                  chainId,
                  linkedAccount.sourceAccountAddress as EVMAccountAddress,
                );
              }),
            );
          }),
        );
      })
      .map((nftArr) => {
        return nftArr.flat(2);
      });
  }

  private getLatestNFTs(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMNFT[], PersistenceError | AccountNFTError | AjaxError> {
    return ResultUtils.combine([
      this.accountNFTs.getEVMNftRepository(),
      this.accountNFTs.getSimulatorEVMNftRepository(),
    ]).andThen(([evmRepo, simulatorRepo]) => {
      const chainInfo = chainConfig.get(chainId);
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

  public getTransactionsArray(): ResultAsync<
    IChainTransaction[],
    PersistenceError
  > {
    return this.getAccounts().andThen((accounts) => {
      return ResultUtils.combine(
        accounts.map((account) => {
          return ResultUtils.combine([
            this.volatileStorage
              .getCursor<EVMTransaction>(
                ELocalStorageKey.TRANSACTIONS,
                "to",
                account.sourceAccountAddress,
              )
              .andThen((cursor) => cursor.allValues().map((evm) => evm!)),
            this.volatileStorage
              .getCursor<EVMTransaction>(
                ELocalStorageKey.TRANSACTIONS,
                "from",
                account.sourceAccountAddress,
              )
              .andThen((cursor) => cursor.allValues().map((evm) => evm!)),
          ]).andThen(([toTransactions, fromTransactions]) => {
            return this.pushTransaction(toTransactions, fromTransactions, []);
          });
        }),
      ).andThen(([transactionsArray]) => {
        return this.compoundTransaction(transactionsArray);
      });
    });
  }

  protected pushTransaction(
    incomingTransaction: EVMTransaction[],
    outgoingTransaction: EVMTransaction[],
    chainTransaction: IChainTransaction[],
  ): ResultAsync<IChainTransaction[], PersistenceError> {
    for (let i = 0; i < incomingTransaction.length; i++) {
      let valueQuote = incomingTransaction[i].valueQuote;
      if (valueQuote == null || valueQuote == undefined) {
        valueQuote = 0;
      }
      chainTransaction.push(
        new ChainTransaction(
          incomingTransaction[i].chainId,
          BigNumberString("1"),
          BigNumberString(
            BigNumber.from(BigInt(Math.round(valueQuote))).toString(),
          ),
          BigNumberString("0"),
          BigNumberString("0"),
        ),
        // {
        //   "chainId": incomingTransaction[i].chainId,
        //   "incomingCount": BigNumberString("1"),
        //   "incomingValue": BigNumberString((BigNumber.from(BigInt(Math.round(valueQuote)))).toString()),
        //   "outgoingCount": BigNumberString("0"),
        //   "outgoingValue": BigNumberString("0")
        // }
      );
    }
    for (let i = 0; i < outgoingTransaction.length; i++) {
      let valueQuote = outgoingTransaction[i].valueQuote;
      if (valueQuote == null || valueQuote == undefined) {
        valueQuote = 0;
      }
      chainTransaction.push({
        chainId: outgoingTransaction[i].chainId,
        incomingCount: BigNumberString("0"),
        incomingValue: BigNumberString("0"),
        outgoingCount: BigNumberString("1"),
        outgoingValue: BigNumberString(
          BigNumber.from(BigInt(Math.round(valueQuote))).toString(),
        ),
      });
    }

    return okAsync(chainTransaction);
  }

  protected compoundTransaction(
    chainTransaction: IChainTransaction[],
  ): ResultAsync<IChainTransaction[], PersistenceError> {
    const flowMap = new Map<ChainId, IChainTransaction>();
    chainTransaction.forEach((obj) => {
      const getObject = flowMap.get(obj.chainId)!;
      if (flowMap.has(obj.chainId)) {
        flowMap.set(obj.chainId, {
          chainId: obj.chainId,
          outgoingValue: BigNumberString(
            BigNumber.from(obj.outgoingValue.toString())
              .add(getObject.outgoingValue.toString())
              .toString(),
          ),
          outgoingCount: BigNumberString(
            BigNumber.from(obj.outgoingCount.toString())
              .add(getObject.outgoingCount.toString())
              .toString(),
          ),
          incomingValue: BigNumberString(
            BigNumber.from(obj.incomingValue.toString())
              .add(getObject.incomingValue.toString())
              .toString(),
          ),
          incomingCount: BigNumberString(
            BigNumber.from(obj.incomingCount.toString())
              .add(getObject.incomingCount.toString())
              .toString(),
          ),
        });
      } else {
        flowMap.set(obj.chainId, {
          chainId: obj.chainId,
          outgoingValue: BigNumberString(
            BigNumber.from(obj.outgoingValue.toString()).toString(),
          ),
          outgoingCount: BigNumberString(
            BigNumber.from(obj.outgoingCount.toString()).toString(),
          ),
          incomingValue: BigNumberString(
            BigNumber.from(obj.incomingValue.toString()).toString(),
          ),
          incomingCount: BigNumberString(
            BigNumber.from(obj.incomingCount.toString()).toString(),
          ),
        });
      }
    });

    const outputFlow: IChainTransaction[] = [];
    flowMap.forEach((element, key) => {
      outputFlow.push(element);
    });

    return okAsync(outputFlow);
  }

  public addEVMTransactions(
    transactions: EVMTransaction[],
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

  public getEVMTransactions(
    filter?: EVMTransactionFilter,
  ): ResultAsync<EVMTransaction[], PersistenceError> {
    return this.waitForRestore().andThen(() => {
      return this.volatileStorage
        .getAll<EVMTransaction>(ELocalStorageKey.TRANSACTIONS)
        .map((transactions) => {
          if (filter == undefined) {
            return transactions;
          }

          return transactions.filter((value) => filter.matches(value));
        });
    });
  }

  public getLatestTransactionForAccount(
    chainId: ChainId,
    address: EVMAccountAddress,
  ): ResultAsync<EVMTransaction | null, PersistenceError> {
    return this.waitForRestore().andThen(() => {
      const filter = new EVMTransactionFilter([chainId], [address]);

      return this.volatileStorage
        .getCursor<EVMTransaction>(
          ELocalStorageKey.TRANSACTIONS,
          "timestamp",
          undefined,
          "prev",
        )
        .andThen((cursor) => this._getNextMatchingTx(cursor, filter));
    });
  }

  private _getNextMatchingTx(
    cursor: IVolatileCursor<EVMTransaction>,
    filter: EVMTransactionFilter,
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

  public postBackups(): ResultAsync<
    DataWalletBackupID[],
    PersistenceError | AjaxError
  > {
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
    IChainTransaction[],
    PersistenceError
  > {
    const chainlist: IChainTransaction[] = [];
    return okAsync(chainlist);
  }

  public clearCloudStore(): ResultAsync<void, PersistenceError | AjaxError> {
    return this.cloudStorage.clear();
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
