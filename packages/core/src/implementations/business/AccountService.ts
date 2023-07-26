/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ICryptoUtils,
  ICryptoUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
} from "@snickerdoodlelabs/insight-platform-api";
import {
  AccountAddress,
  AESEncryptedString,
  AjaxError,
  BigNumberString,
  BlockchainProviderError,
  ChainId,
  ChainTransaction,
  CrumbsContractError,
  DataWalletAddress,
  EChain,
  EVMAccountAddress,
  EVMPrivateKey,
  TransactionFilter,
  ExternallyOwnedAccount,
  TokenBalanceWithOwnerAddress,
  WalletNFT,
  InvalidParametersError,
  InvalidSignatureError,
  LanguageCode,
  LinkedAccount,
  MinimalForwarderContractError,
  PersistenceError,
  Signature,
  SiteVisit,
  TokenId,
  UninitializedError,
  UnsupportedLanguageError,
  URLString,
  EarnedReward,
  TokenAddress,
  UnixTimestamp,
  DataWalletBackupID,
  TransactionPaymentCounter,
  EDataWalletPermission,
  DomainName,
  UnauthorizedError,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  AccountIndexingError,
  PasswordString,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IAccountService } from "@core/interfaces/business/index.js";
import {
  IPermissionUtils,
  IPermissionUtilsType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IBrowsingDataRepository,
  IBrowsingDataRepositoryType,
  ICrumbsRepository,
  ICrumbsRepositoryType,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
  IMetatransactionForwarderRepository,
  IMetatransactionForwarderRepositoryType,
  IPortfolioBalanceRepository,
  IPortfolioBalanceRepositoryType,
  ITransactionHistoryRepository,
  ITransactionHistoryRepositoryType,
} from "@core/interfaces/data/index.js";
import { MetatransactionRequest } from "@core/interfaces/objects/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IDataWalletUtils,
  IDataWalletUtilsType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class AccountService implements IAccountService {
  public constructor(
    @inject(IPermissionUtilsType) protected permissionUtils: IPermissionUtils,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(ICrumbsRepositoryType)
    protected crumbsRepo: ICrumbsRepository,
    @inject(IMetatransactionForwarderRepositoryType)
    protected metatransactionForwarderRepo: IMetatransactionForwarderRepository,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IDataWalletUtilsType) protected dataWalletUtils: IDataWalletUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILinkedAccountRepositoryType)
    protected accountRepo: ILinkedAccountRepository,
    @inject(ITransactionHistoryRepositoryType)
    protected transactionRepo: ITransactionHistoryRepository,
    @inject(IBrowsingDataRepositoryType)
    protected browsingDataRepo: IBrowsingDataRepository,
    @inject(IPortfolioBalanceRepositoryType)
    protected balanceRepo: IPortfolioBalanceRepository,
  ) {}

  public getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp: UnixTimestamp,
  ): ResultAsync<number, AccountIndexingError> {
    return this.tokenPriceRepo.getTokenPrice(chainId, address, timestamp);
  }

  public getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, UnsupportedLanguageError> {
    switch (languageCode) {
      case LanguageCode("en"):
        return okAsync("Login to your Snickerdoodle data wallet");
      default:
        return errAsync(
          new UnsupportedLanguageError(
            languageCode,
            `Language ${languageCode} is not supported yet, please choose a different language`,
          ),
        );
    }
  }

  public unlock(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    void,
    | PersistenceError
    | AjaxError
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | MinimalForwarderContractError
    | BlockchainCommonErrors
  > {
    // First, let's do some validation and make sure that the signature is actually for the account
    return this.validateSignatureForAddress(
      accountAddress,
      signature,
      languageCode,
      chain,
    )
      .andThen(() => {
        // Next step is to convert the signature into a derived account
        return ResultUtils.combine([
          this.dataWalletUtils.getDerivedEVMAccountFromSignature(
            accountAddress,
            signature,
          ),
          this.contextProvider.getContext(),
        ]);
      })
      .andThen(([derivedEOA, context]) => {
        return this.crumbsRepo
          .getCrumb(derivedEOA.accountAddress, languageCode)
          .andThen((encryptedDataWalletKey) => {
            // If we're already in the process of unlocking
            if (context.unlockInProgress) {
              return errAsync(
                new InvalidSignatureError(
                  "Unlock already in progress, please wait for it to complete.",
                ),
              );
            }

            // You can't unlock if we're already unlocked!
            if (context.dataWalletAddress != null) {
              return errAsync(
                new InvalidSignatureError(
                  `Data wallet ${context.dataWalletAddress} is already unlocked!`,
                ),
              );
            }

            // Need to update the context
            context.unlockInProgress = true;
            return this.contextProvider
              .setContext(context)
              .andThen(() => {
                if (encryptedDataWalletKey == null) {
                  // We're trying to unlock for the first time!
                  this.logUtils.info(
                    `Creating a new data wallet linked to ${accountAddress}`,
                  );
                  return this.createDataWallet(
                    accountAddress,
                    signature,
                    languageCode,
                    derivedEOA,
                  );
                }
                this.logUtils.info(
                  `Existing crumb found for ${accountAddress}`,
                );
                return this.getDataWalletAccount(
                  encryptedDataWalletKey,
                  accountAddress,
                  signature,
                );
              })
              .andThen((dataWalletAccount) => {
                // console.log(
                //   "Data wallet address initialized: ",
                //   dataWalletAccount.accountAddress,
                // );

                // The account address in account is just a generic EVMAccountAddress,
                // we need to cast it to a DataWalletAddress, since in this case, that's
                // what it is.
                context.dataWalletAddress = DataWalletAddress(
                  dataWalletAccount.accountAddress,
                );
                context.dataWalletKey = dataWalletAccount.privateKey;
                context.unlockInProgress = false;

                // We can update the context and provide the key to the persistence in one step
                return ResultUtils.combine([
                  this.dataWalletPersistence.unlock(
                    dataWalletAccount.privateKey,
                  ),
                  this.contextProvider.setContext(context),
                ]);
              })
              .andThen(() => {
                // This is a bit of a hack.
                // The problem is, if you have an existing data wallet, but don't have the data
                // for that wallet, when you call getAccounts() after unlocking you'll get a complete
                // blank. This assures us that we have at LEAST the account that unlocked the wallet
                // in our persistence.
                return this.accountRepo.addAccount(
                  new LinkedAccount(
                    chain,
                    accountAddress,
                    derivedEOA.accountAddress,
                  ),
                );
              })
              .andThen(() => {
                // Need to emit some events
                context.publicEvents.onInitialized.next(
                  context.dataWalletAddress!,
                );

                // If the account was newly added, event out
                if (encryptedDataWalletKey == null) {
                  context.publicEvents.onAccountAdded.next(
                    new LinkedAccount(
                      chain,
                      accountAddress,
                      derivedEOA.accountAddress,
                    ),
                  );
                }
                // No need to add the account to persistence
                return okAsync(undefined);

                // Placeholder for any action we want to do to verify the account
                // is in the data wallet or other sanity checking
                return okAsync(undefined);
              });
          })
          .orElse((e) => {
            // Any error in this process will cause me to revert the context
            return this.contextProvider
              .getContext()
              .andThen((context) => {
                context.dataWalletAddress = null;
                context.dataWalletKey = null;
                context.unlockInProgress = false;

                return this.contextProvider.setContext(context);
              })
              .andThen(() => {
                return errAsync(e);
              });
          });
      });
  }

  public addAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | PersistenceError
    | AjaxError
    | MinimalForwarderContractError
    | BlockchainCommonErrors
  > {
    // First, let's do some validation and make sure that the signature is actually for the account
    return this.validateSignatureForAddress(
      accountAddress,
      signature,
      languageCode,
      chain,
    )
      .andThen(() => {
        return ResultUtils.combine([
          this.dataWalletUtils.getDerivedEVMAccountFromSignature(
            accountAddress,
            signature,
          ),
          this.contextProvider.getContext(),
          this.dataWalletUtils.deriveEncryptionKeyFromSignature(
            accountAddress,
            signature,
          ),
        ]);
      })
      .andThen(([derivedEOA, context, encryptionKey]) => {
        if (
          context.dataWalletAddress == null ||
          context.dataWalletKey == null
        ) {
          return errAsync(
            new UninitializedError(
              "Core must be unlocked first before you can add an additional account",
            ),
          );
        }

        return this.crumbsRepo
          .getCrumb(derivedEOA.accountAddress, languageCode)
          .andThen((existingCrumb) => {
            if (existingCrumb != null) {
              // There is already a crumb on chain for this account; odds are the
              // account is already connected. If we want to be cool,
              // we'd double check. For right now, we'll just return, and figure
              // the job is done
              return okAsync(undefined);
            }

            // Encrypt the data wallet key with this new encryption key
            return this.cryptoUtils
              .encryptString(context.dataWalletKey!, encryptionKey)
              .andThen((encryptedDataWalletKey) => {
                return this.addCrumb(
                  languageCode,
                  encryptedDataWalletKey,
                  derivedEOA.privateKey,
                );
              });
          })
          .andThen(() => {
            // Add the account to the data wallet
            return this.accountRepo.addAccount(
              new LinkedAccount(
                chain,
                accountAddress,
                derivedEOA.accountAddress,
              ),
            );
          })
          .andThen(() => {
            // We need to post a backup immediately upon adding an account, so that we don't lose access
            return this.dataWalletPersistence.postBackups();
          })
          .map(() => {
            // Notify the outside world of what we did
            context.publicEvents.onAccountAdded.next(
              new LinkedAccount(
                chain,
                accountAddress,
                derivedEOA.accountAddress,
              ),
            );
          });
      });
  }

  public unlinkAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    void,
    | PersistenceError
    | InvalidParametersError
    | BlockchainProviderError
    | UninitializedError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | CrumbsContractError
    | AjaxError
    | MinimalForwarderContractError
    | BlockchainCommonErrors
  > {
    // First, let's do some validation and make sure that the signature is actually for the account
    return this.validateSignatureForAddress(
      accountAddress,
      signature,
      languageCode,
      chain,
    ).andThen(() => {
      return this.accountRepo
        .getAccounts()
        .andThen((accounts) => {
          // Two things
          // First, we can't remove the last account from your data wallet, so we need
          // to make sure you're not doing that.
          // Second, we want to make sure the request is for a valid account that is in
          // your wallet
          const account = accounts.find((account) => {
            return account.sourceAccountAddress == accountAddress;
          });
          if (account == null) {
            return errAsync(
              new InvalidParametersError(
                `Account ${accountAddress} is not linked to your data wallet`,
              ),
            );
          }

          if (accounts.length <= 1) {
            return errAsync(
              new InvalidParametersError(
                `Can not remove the last account from your data wallet`,
              ),
            );
          }
          return ResultUtils.combine([
            this.contextProvider.getContext(),
            this.dataWalletUtils.getDerivedEVMAccountFromSignature(
              accountAddress,
              signature,
            ),
          ]);
        })
        .andThen(([context, derivedEVMAccount]) => {
          if (
            context.dataWalletAddress == null ||
            context.dataWalletKey == null
          ) {
            return errAsync(
              new UninitializedError(
                "Core must be unlocked first before you can add an additional account",
              ),
            );
          }

          return this.crumbsRepo
            .getCrumbTokenId(derivedEVMAccount.accountAddress)
            .andThen((crumbTokenId) => {
              if (crumbTokenId == null) {
                // We can't unlink an account with no crumb
                return errAsync(
                  new UninitializedError(
                    `No crumb found for account ${accountAddress}`,
                  ),
                );
              }

              // Remove the crumb
              return this.removeCrumb(derivedEVMAccount, crumbTokenId)
                .andThen(() => {
                  // Add the account to the data wallet
                  return this.accountRepo.removeAccount(accountAddress);
                })
                .andThen(() => {
                  // We need to post a backup immediately upon adding an account, so that we don't lose access
                  return this.dataWalletPersistence.postBackups();
                })
                .map(() => {
                  // Notify the outside world of what we did
                  context.publicEvents.onAccountRemoved.next(
                    new LinkedAccount(
                      chain,
                      accountAddress,
                      derivedEVMAccount.accountAddress,
                    ),
                  );
                });
            });
        });
    });
  }

  public getDataWalletForAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    DataWalletAddress | null,
    | PersistenceError
    | UninitializedError
    | BlockchainProviderError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | BlockchainCommonErrors
  > {
    // First, let's do some validation and make sure that the signature is actually for the account
    return this.validateSignatureForAddress(
      accountAddress,
      signature,
      languageCode,
      chain,
    )
      .andThen(() => {
        // Next step is to convert the signature into a derived account
        return this.dataWalletUtils.getDerivedEVMAccountFromSignature(
          accountAddress,
          signature,
        );
      })
      .andThen((derivedEOA) => {
        return this.crumbsRepo
          .getCrumb(derivedEOA.accountAddress, languageCode)
          .andThen((encryptedDataWalletKey) => {
            if (encryptedDataWalletKey == null) {
              // There's no crumb for this data wallet at all, so there's no data wallet
              return okAsync(null);
            }

            // There is a crumb!
            return this.getDataWalletAccount(
              encryptedDataWalletKey,
              accountAddress,
              signature,
            ).map((dataWalletAccount) => {
              return DataWalletAddress(dataWalletAccount.accountAddress);
            });
          });
      });
  }

  public unlockWithPassword(
    password: PasswordString,
  ): ResultAsync<
    void,
    | UnsupportedLanguageError
    | PersistenceError
    | AjaxError
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | InvalidSignatureError
    | MinimalForwarderContractError
    | BlockchainCommonErrors
  > {
    // Next step is to convert the signature into a derived account
    return ResultUtils.combine([
      this.dataWalletUtils.getDerivedEVMAccountFromPassword(password),
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
    ]).andThen(([derivedEOA, context, config]) => {
      return this.crumbsRepo
        .getCrumb(derivedEOA.accountAddress, config.passwordLanguageCode)
        .andThen((encryptedDataWalletKey) => {
          // If we're already in the process of unlocking
          if (context.unlockInProgress) {
            return errAsync(
              new InvalidSignatureError(
                "Unlock already in progress, please wait for it to complete.",
              ),
            );
          }

          // You can't unlock if we're already unlocked!
          if (context.dataWalletAddress != null) {
            return errAsync(
              new InvalidSignatureError(
                `Data wallet ${context.dataWalletAddress} is already unlocked!`,
              ),
            );
          }

          // Need to update the context
          context.unlockInProgress = true;
          return this.contextProvider
            .setContext(context)
            .andThen(() => {
              if (encryptedDataWalletKey == null) {
                // We're trying to unlock for the first time!
                this.logUtils.info(
                  `Creating a new data wallet linked to password`,
                );
                return this.createDataWalletFromPassword(password, derivedEOA);
              }
              this.logUtils.info(`Existing crumb found for password`);
              return this.getDataWalletAccountFromPassword(
                encryptedDataWalletKey,
                password,
              );
            })
            .andThen((dataWalletAccount) => {
              // The account address in account is just a generic EVMAccountAddress,
              // we need to cast it to a DataWalletAddress, since in this case, that's
              // what it is.
              context.dataWalletAddress = DataWalletAddress(
                dataWalletAccount.accountAddress,
              );
              context.dataWalletKey = dataWalletAccount.privateKey;
              context.unlockInProgress = false;

              // We can update the context and provide the key to the persistence in one step
              return ResultUtils.combine([
                this.dataWalletPersistence.unlock(dataWalletAccount.privateKey),
                this.contextProvider.setContext(context),
              ]);
            })
            .andThen(() => {
              // Need to emit some events
              context.publicEvents.onInitialized.next(
                context.dataWalletAddress!,
              );

              // If the account was newly added, event out
              if (encryptedDataWalletKey == null) {
                context.publicEvents.onPasswordAdded.next(undefined);
              }
              // No need to add the account to persistence
              return okAsync(undefined);
            });
        })
        .orElse((e) => {
          // Any error in this process will cause me to revert the context
          return this.contextProvider
            .getContext()
            .andThen((context) => {
              context.dataWalletAddress = null;
              context.dataWalletKey = null;
              context.unlockInProgress = false;

              return this.contextProvider.setContext(context);
            })
            .andThen(() => {
              return errAsync(e);
            });
        });
    });
  }

  public addPassword(
    password: PasswordString,
  ): ResultAsync<
    void,
    | PersistenceError
    | AjaxError
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | MinimalForwarderContractError
    | BlockchainCommonErrors
  > {
    // First, let's do some validation and make sure that the signature is actually for the account
    return ResultUtils.combine([
      this.dataWalletUtils.getDerivedEVMAccountFromPassword(password),
      this.dataWalletUtils.deriveEncryptionKeyFromPassword(password),
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
    ]).andThen(([derivedEOA, encryptionKey, context, config]) => {
      if (context.dataWalletAddress == null || context.dataWalletKey == null) {
        return errAsync(
          new UninitializedError(
            "Core must be unlocked first before you can add an additional account",
          ),
        );
      }

      return this.crumbsRepo
        .getCrumb(derivedEOA.accountAddress, config.passwordLanguageCode)
        .andThen((existingCrumb) => {
          if (existingCrumb != null) {
            // There is already a crumb on chain for this account; odds are the
            // account is already connected. If we want to be cool,
            // we'd double check. For right now, we'll just return, and figure
            // the job is done
            return okAsync(undefined);
          }

          // Encrypt the data wallet key with this new encryption key
          return this.cryptoUtils
            .encryptString(context.dataWalletKey!, encryptionKey)
            .andThen((encryptedDataWalletKey) => {
              return this.addCrumb(
                config.passwordLanguageCode,
                encryptedDataWalletKey,
                derivedEOA.privateKey,
              );
            });
        })
        .andThen(() => {
          // We need to post a backup immediately upon adding an account, so that we don't lose access
          return this.dataWalletPersistence.postBackups();
        })
        .map(() => {
          // Notify the outside world of what we did
          context.publicEvents.onPasswordAdded.next(undefined);
        });
    });
  }

  public removePassword(
    password: PasswordString,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | AjaxError
    | MinimalForwarderContractError
    | BlockchainCommonErrors
  > {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.dataWalletUtils.getDerivedEVMAccountFromPassword(password),
    ]).andThen(([context, derivedEVMAccount]) => {
      if (context.dataWalletAddress == null || context.dataWalletKey == null) {
        return errAsync(
          new UninitializedError(
            "Core must be unlocked first before you can remove a password",
          ),
        );
      }

      return this.crumbsRepo
        .getCrumbTokenId(derivedEVMAccount.accountAddress)
        .andThen((crumbTokenId) => {
          if (crumbTokenId == null) {
            // We can't unlink an account with no crumb
            return errAsync(
              new UninitializedError(
                `No crumb found for account ${derivedEVMAccount.accountAddress}`,
              ),
            );
          }

          // Remove the crumb
          return this.removeCrumb(derivedEVMAccount, crumbTokenId);
        })
        .map(() => {
          // Notify the outside world of what we did
          context.publicEvents.onPasswordRemoved.next(undefined);
        });
    });
  }

  public getAccounts(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<LinkedAccount[], UnauthorizedError | PersistenceError> {
    return this.permissionUtils
      .assureSourceDomainHasPermission(
        sourceDomain,
        EDataWalletPermission.ReadLinkedAccounts,
      )
      .andThen(() => {
        return this.accountRepo.getAccounts();
      });
  }

  public getAccountBalances(): ResultAsync<
    TokenBalanceWithOwnerAddress[],
    PersistenceError
  > {
    return this.balanceRepo.getAccountBalancesWithOwnerAddress();
  }

  public getAccountNFTs(): ResultAsync<WalletNFT[], PersistenceError> {
    return this.balanceRepo.getAccountNFTs();
  }

  public getEarnedRewards(): ResultAsync<EarnedReward[], PersistenceError> {
    return this.accountRepo.getEarnedRewards();
  }

  public addEarnedRewards(
    rewards: EarnedReward[],
  ): ResultAsync<void, PersistenceError> {
    return this.accountRepo.addEarnedRewards(rewards);
  }

  public getTranactions(
    filter?: TransactionFilter,
  ): ResultAsync<ChainTransaction[], PersistenceError> {
    return this.transactionRepo.getTransactions(filter);
  }

  public getTransactionValueByChain(): ResultAsync<
    TransactionPaymentCounter[],
    PersistenceError
  > {
    return this.transactionRepo.getTransactionByChain();
  }

  public getSiteVisitsMap(): ResultAsync<
    Map<URLString, number>,
    PersistenceError
  > {
    return this.browsingDataRepo.getSiteVisitsMap();
  }

  public addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, PersistenceError> {
    return this.filterInvalidDomains(siteVisits).andThen((validSiteVisits) => {
      return this.browsingDataRepo.addSiteVisits(validSiteVisits);
    });
  }
  public getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError> {
    return this.browsingDataRepo.getSiteVisits();
  }

  public addTransactions(
    transactions: ChainTransaction[],
  ): ResultAsync<void, PersistenceError> {
    return this.transactionRepo.addTransactions(transactions);
  }

  public postBackups(): ResultAsync<DataWalletBackupID[], PersistenceError> {
    return this.dataWalletPersistence
      .postBackups()
      .mapErr((e) => new PersistenceError("error posting backups", e));
  }

  public clearCloudStore(): ResultAsync<void, PersistenceError> {
    return this.dataWalletPersistence.clearCloudStore();
  }

  protected addCrumb(
    languageCode: LanguageCode,
    encryptedDataWalletKey: AESEncryptedString,
    derivedEVMKey: EVMPrivateKey,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | MinimalForwarderContractError
    | AjaxError
    | BlockchainCommonErrors
  > {
    const derivedEVMAccountAddress =
      this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(derivedEVMKey);

    // We need to get a nonce for this account address from the forwarder contract
    return ResultUtils.combine([
      this.metatransactionForwarderRepo.getNonce(derivedEVMAccountAddress),
      this.crumbsRepo.encodeCreateCrumb(languageCode, encryptedDataWalletKey),
      this.configProvider.getConfig(),
    ]).andThen(([nonce, { callData, crumbId }, config]) => {
      this.logUtils.info(
        `Creating new crumb token for derived account ${derivedEVMAccountAddress} with crumbId ${crumbId}`,
      );

      // Create a metatransaction request to get a signature
      return this.metatransactionForwarderRepo
        .signMetatransactionRequest(
          new MetatransactionRequest(
            config.controlChainInformation.crumbsContractAddress, // Contract address for the metatransaction
            derivedEVMAccountAddress, // EOA to run the transaction as
            BigNumber.from(0), // The amount of doodle token to pay. Should be 0.
            BigNumber.from(config.gasAmounts.createCrumbGas), // gas
            BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
            callData, // The actual bytes of the request, encoded as a hex string
          ),
          derivedEVMKey,
        )
        .andThen((metatransactionSignature) => {
          return this.insightPlatformRepo.executeMetatransaction(
            derivedEVMAccountAddress,
            config.controlChainInformation.crumbsContractAddress,
            nonce,
            BigNumberString(BigNumber.from(0).toString()), // The amount of doodle token to pay. Should be 0.
            BigNumberString(
              BigNumber.from(config.gasAmounts.createCrumbGas).toString(),
            ), // gas
            callData,
            metatransactionSignature,
            derivedEVMKey,
            config.defaultInsightPlatformBaseUrl,
          );
        })
        .map(() => {
          // This is just a double check to make sure the crumb was actually created.
          this.logUtils.debug(
            `Delivered metatransaction to Insight Platform, checking to make sure token was created`,
          );
          this.crumbsRepo
            .getURI(crumbId)
            .map(() => {
              this.logUtils.info(
                `Created crumb for derived account ${derivedEVMAccountAddress} with token ID ${crumbId}`,
              );
            })
            .mapErr((e) => {
              this.logUtils.error(
                `Could not get crumb for derived account ${derivedEVMAccountAddress} with token ID ${crumbId}`,
              );
            });
        });
    });
  }

  protected removeCrumb(
    derivedEVMAccount: ExternallyOwnedAccount,
    crumbId: TokenId,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | MinimalForwarderContractError
    | AjaxError
    | BlockchainCommonErrors
  > {
    // We need to get a nonce for this account address from the forwarder contract
    return ResultUtils.combine([
      this.metatransactionForwarderRepo.getNonce(
        derivedEVMAccount.accountAddress,
      ),
      this.crumbsRepo.encodeBurnCrumb(crumbId),
      this.configProvider.getConfig(),
    ]).andThen(([nonce, callData, config]) => {
      return this.metatransactionForwarderRepo
        .signMetatransactionRequest(
          new MetatransactionRequest(
            config.controlChainInformation.crumbsContractAddress, // Contract address for the metatransaction
            derivedEVMAccount.accountAddress, // EOA to run the transaction as
            BigNumber.from(0), // The amount of doodle token to pay. Should be 0.
            BigNumber.from(config.gasAmounts.removeCrumbGas), // gas
            BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
            callData, // The actual bytes of the request, encoded as a hex string
          ),
          derivedEVMAccount.privateKey,
        )
        .andThen((metatransactionSignature) => {
          return this.insightPlatformRepo.executeMetatransaction(
            derivedEVMAccount.accountAddress,
            config.controlChainInformation.crumbsContractAddress,
            nonce,
            BigNumberString(BigNumber.from(0).toString()), // The amount of doodle token to pay. Should be 0.
            BigNumberString(
              BigNumber.from(config.gasAmounts.removeCrumbGas).toString(),
            ), // gas
            callData,
            metatransactionSignature,
            derivedEVMAccount.privateKey,
            config.defaultInsightPlatformBaseUrl,
          );
        });
    });
  }

  protected filterInvalidDomains(
    domains: SiteVisit[],
  ): ResultAsync<SiteVisit[], never> {
    return this.configProvider.getConfig().map(({ domainFilter }) => {
      const invalidDomains = new RegExp(domainFilter);

      return domains.filter(({ url }) => !invalidDomains.test(url));
    });
  }

  protected validateSignatureForAddress(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<void, InvalidSignatureError | UnsupportedLanguageError> {
    return this.getUnlockMessage(languageCode)
      .andThen((unlockMessage) => {
        return this.dataWalletUtils.verifySignature(
          chain,
          accountAddress,
          signature,
          unlockMessage,
        );
      })
      .andThen((verified) => {
        if (verified) {
          return okAsync(undefined);
        }

        return errAsync(
          new InvalidSignatureError(
            `Provided signature from account address ${accountAddress} on chain ${chain} is invalid`,
          ),
        );
      });
  }

  protected createDataWallet(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    derivedEVMAccount: ExternallyOwnedAccount,
  ): ResultAsync<
    ExternallyOwnedAccount,
    | BlockchainProviderError
    | UninitializedError
    | AjaxError
    | MinimalForwarderContractError
    | BlockchainCommonErrors
  > {
    return ResultUtils.combine([
      this.dataWalletUtils.createDataWalletKey(),
      this.dataWalletUtils.deriveEncryptionKeyFromSignature(
        accountAddress,
        signature,
      ),
    ]).andThen(([dataWalletKey, encryptionKey]) => {
      // Encrypt the data wallet key
      return this.cryptoUtils
        .encryptString(dataWalletKey, encryptionKey)
        .andThen((encryptedDataWallet) => {
          const dataWalletAddress = DataWalletAddress(
            this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
              dataWalletKey,
            ),
          );

          // We can add the crumb directly
          return this.addCrumb(
            languageCode,
            encryptedDataWallet,
            derivedEVMAccount.privateKey,
          ).map(() => {
            return new ExternallyOwnedAccount(
              EVMAccountAddress(dataWalletAddress),
              dataWalletKey,
            );
          });
        });
    });
  }

  protected createDataWalletFromPassword(
    password: PasswordString,
    derivedEVMAccount: ExternallyOwnedAccount,
  ): ResultAsync<
    ExternallyOwnedAccount,
    | BlockchainProviderError
    | UninitializedError
    | AjaxError
    | MinimalForwarderContractError
    | BlockchainCommonErrors
  > {
    return ResultUtils.combine([
      this.dataWalletUtils.createDataWalletKey(),
      this.dataWalletUtils.deriveEncryptionKeyFromPassword(password),
      this.configProvider.getConfig(),
    ]).andThen(([dataWalletKey, encryptionKey, config]) => {
      // Encrypt the data wallet key
      return this.cryptoUtils
        .encryptString(dataWalletKey, encryptionKey)
        .andThen((encryptedDataWallet) => {
          const dataWalletAddress = DataWalletAddress(
            this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
              dataWalletKey,
            ),
          );

          // We can add the crumb directly
          return this.addCrumb(
            config.passwordLanguageCode,
            encryptedDataWallet,
            derivedEVMAccount.privateKey,
          ).map(() => {
            return new ExternallyOwnedAccount(
              EVMAccountAddress(dataWalletAddress),
              dataWalletKey,
            );
          });
        });
    });
  }

  protected getDataWalletAccount(
    encryptedDataWalletKey: AESEncryptedString,
    accountAddress: AccountAddress,
    signature: Signature,
  ): ResultAsync<
    ExternallyOwnedAccount,
    BlockchainProviderError | InvalidSignatureError | UnsupportedLanguageError
  > {
    return this.dataWalletUtils
      .deriveEncryptionKeyFromSignature(accountAddress, signature)
      .andThen((encryptionKey) => {
        return this.cryptoUtils.decryptAESEncryptedString(
          encryptedDataWalletKey,
          encryptionKey,
        );
      })
      .map((dataWalletKey) => {
        const key = EVMPrivateKey(dataWalletKey);
        return new ExternallyOwnedAccount(
          this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(key),
          key,
        );
      });
  }

  protected getDataWalletAccountFromPassword(
    encryptedDataWalletKey: AESEncryptedString,
    password: PasswordString,
  ): ResultAsync<
    ExternallyOwnedAccount,
    BlockchainProviderError | InvalidSignatureError | UnsupportedLanguageError
  > {
    return this.dataWalletUtils
      .deriveEncryptionKeyFromPassword(password)
      .andThen((encryptionKey) => {
        return this.cryptoUtils.decryptAESEncryptedString(
          encryptedDataWalletKey,
          encryptionKey,
        );
      })
      .map((dataWalletKey) => {
        const key = EVMPrivateKey(dataWalletKey);
        return new ExternallyOwnedAccount(
          this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(key),
          key,
        );
      });
  }
}
