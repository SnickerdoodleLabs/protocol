/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  AccountAddress,
  ChainId,
  ChainTransaction,
  DataWalletAddress,
  EChain,
  TransactionFilter,
  ExternallyOwnedAccount,
  TokenBalance,
  WalletNFT,
  InvalidParametersError,
  InvalidSignatureError,
  LanguageCode,
  LinkedAccount,
  PersistenceError,
  Signature,
  SiteVisit,
  UninitializedError,
  UnsupportedLanguageError,
  EarnedReward,
  TokenAddress,
  UnixTimestamp,
  DataWalletBackupID,
  TransactionPaymentCounter,
  DomainName,
  UnauthorizedError,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  AccountIndexingError,
  SiteVisitsMap,
  getChainInfoByChain,
  EChainTechnology,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IAccountService } from "@core/interfaces/business/index.js";
import {
  IPermissionUtils,
  IPermissionUtilsType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IBrowsingDataRepository,
  IBrowsingDataRepositoryType,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IEntropyRepository,
  IEntropyRepositoryType,
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
  IPortfolioBalanceRepository,
  IPortfolioBalanceRepositoryType,
  ITransactionHistoryRepository,
  ITransactionHistoryRepositoryType,
  IAuthenticatedStorageRepository,
  IAuthenticatedStorageRepositoryType,
} from "@core/interfaces/data/index.js";
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
    @inject(IAuthenticatedStorageRepositoryType)
    protected authenticatedStorageRepo: IAuthenticatedStorageRepository,
    @inject(IEntropyRepositoryType) protected entropyRepo: IEntropyRepository,
    @inject(IPermissionUtilsType) protected permissionUtils: IPermissionUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IDataWalletUtilsType) protected dataWalletUtils: IDataWalletUtils,
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
    address: TokenAddress,
    timestamp: UnixTimestamp,
  ): ResultAsync<number, AccountIndexingError> {
    return this.tokenPriceRepo.getTokenPrice(chainId, address, timestamp);
  }

  public getLinkAccountMessage(
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

  public initialize(): ResultAsync<void, PersistenceError> {
    // First, let's do some validation and make sure that the signature is actually for the account
    return this.entropyRepo
      .getDataWalletPrivateKey()
      .andThen((dataWalletAccount) => {
        if (dataWalletAccount == null) {
          this.logUtils.warning(
            "No data wallet account found, creating a new one",
          );
          return this.entropyRepo
            .createDataWalletPrivateKey()
            .andThen((newDataWalletAccount) => {
              // We need to unlock before we can write the new key
              return this.activateAuthenticatedStorage(newDataWalletAccount)
                .andThen(() => {
                  return this.entropyRepo.setDataWalletPrivateKey(
                    newDataWalletAccount.privateKey,
                  );
                })
                .map(() => {
                  return newDataWalletAccount;
                });
            });
        }
        this.logUtils.log(
          `Existing Data Wallet ${dataWalletAccount.accountAddress} found in volatile storage`,
        );
        return this.activateAuthenticatedStorage(dataWalletAccount);
      })
      .andThen((dataWalletAccount) => {
        return this.contextProvider.getContext().andThen((context) => {
          // The account address in account is just a generic EVMAccountAddress,
          // we need to cast it to a DataWalletAddress, since in this case, that's
          // what it is.
          context.dataWalletAddress = DataWalletAddress(
            dataWalletAccount.accountAddress,
          );
          context.dataWalletKey = dataWalletAccount.privateKey;
          context.initializeInProgress = false;

          // We can update the context and provide the key to the persistence in one step
          return this.contextProvider.setContext(context).map(() => {
            // Need to emit some events
            context.publicEvents.onInitialized.next(context.dataWalletAddress!);
          });
        });
      })
      .orElse((e) => {
        // Any error in this process will cause me to revert the context
        return this.contextProvider
          .getContext()
          .andThen((context) => {
            context.dataWalletAddress = null;
            context.dataWalletKey = null;
            context.initializeInProgress = false;

            return this.contextProvider.setContext(context);
          })
          .andThen(() => {
            return errAsync(e);
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
    | PersistenceError
    | UninitializedError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | InvalidParametersError
  > {
    // First, let's do some validation and make sure that the signature is actually for the account
    return this.getLinkAccountMessage(languageCode)
      .andThen((message) => {
        return this.validateSignatureForAddress(
          accountAddress,
          signature,
          message,
          chain,
        );
      })
      .andThen(() => {
        console.log("before get context: ");
        return this.contextProvider.getContext();
      })
      .andThen((context) => {
        console.log("context: " + context);

        if (
          context.dataWalletAddress == null ||
          context.dataWalletKey == null
        ) {
          return errAsync(
            new UninitializedError(
              "Core must be initialized first before you can add an additional account",
            ),
          );
        }

        console.log("accountAddress: " + accountAddress);
        console.log("chain: " + chain);

        // Check if the account is already linked
        return this.accountRepo
          .getLinkedAccount(accountAddress, chain)
          .andThen((existingAccount) => {
            if (existingAccount != null) {
              // The account is already linked
              return errAsync(
                new InvalidParametersError(
                  `Account ${accountAddress} is already linked to your data wallet`,
                ),
              );
            }

            // Add the account to the data wallet
            return this.accountRepo.addAccount(
              new LinkedAccount(chain, accountAddress),
            );
          })
          .map(() => {
            // Notify the outside world of what we did
            context.privateEvents.postBackupsRequested.next();
            context.publicEvents.onAccountAdded.next(
              new LinkedAccount(chain, accountAddress),
            );
          });
      });
  }

  public addAccountWithExternalSignature(
    accountAddress: AccountAddress,
    message: string,
    signature: Signature,
    chain: EChain,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | InvalidParametersError
  > {
    // First, let's do some validation and make sure that the signature is actually for the account
    return this.validateSignatureForAddress(
      accountAddress,
      signature,
      message,
      chain,
    )
      .andThen(() => {
        console.log("before get context: ");
        return this.contextProvider.getContext();
      })
      .andThen((context) => {
        console.log("context: " + context);

        if (
          context.dataWalletAddress == null ||
          context.dataWalletKey == null
        ) {
          return errAsync(
            new UninitializedError(
              "Core must be initialized first before you can add an additional account",
            ),
          );
        }

        console.log("accountAddress: " + accountAddress);
        console.log("chain: " + chain);
        // Check if the account is already linked
        return this.accountRepo
          .getLinkedAccount(accountAddress, chain)
          .andThen((existingAccount) => {
            if (existingAccount != null) {
              // The account is already linked
              return errAsync(
                new InvalidParametersError(
                  `Account ${accountAddress} is already linked to your data wallet`,
                ),
              );
            }

            // Add the account to the data wallet
            return this.accountRepo.addAccount(
              new LinkedAccount(chain, accountAddress),
            );
          })
          .map(() => {
            // Notify the outside world of what we did
            context.privateEvents.postBackupsRequested.next();
            context.publicEvents.onAccountAdded.next(
              new LinkedAccount(chain, accountAddress),
            );
          });
      });
  }

  public addAccountWithExternalTypedDataSignature(
    accountAddress: AccountAddress,
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
    signature: Signature,
    chain: EChain,
    sourceDomain: DomainName | undefined,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | InvalidSignatureError
    | InvalidParametersError
  > {
    // First, let's do some validation and make sure that the signature is actually for the account
    return this.validateTypedDataSignatureForAddress(
      accountAddress,
      domain,
      types,
      value,
      signature,
      chain,
    )
      .andThen(() => {
        return this.contextProvider.getContext();
      })
      .andThen((context) => {
        if (
          context.dataWalletAddress == null ||
          context.dataWalletKey == null
        ) {
          return errAsync(
            new UninitializedError(
              "Core must be initialized first before you can add an additional account",
            ),
          );
        }

        // Check if the account is already linked
        return this.accountRepo
          .getLinkedAccount(accountAddress, chain)
          .andThen((existingAccount) => {
            if (existingAccount != null) {
              // The account is already linked
              return errAsync(
                new InvalidParametersError(
                  `Account ${accountAddress} is already linked to your data wallet`,
                ),
              );
            }

            // Add the account to the data wallet
            return this.accountRepo.addAccount(
              new LinkedAccount(chain, accountAddress),
            );
          })
          .map(() => {
            // Notify the outside world of what we did
            context.privateEvents.postBackupsRequested.next();
            context.publicEvents.onAccountAdded.next(
              new LinkedAccount(chain, accountAddress),
            );
          });
      });
  }

  public unlinkAccount(
    accountAddress: AccountAddress,
    chain: EChain,
  ): ResultAsync<
    void,
    PersistenceError | UninitializedError | InvalidParametersError
  > {
    // First, let's do some validation and make sure that the signature is actually for the account
    return this.accountRepo
      .getLinkedAccount(accountAddress, chain)
      .andThen((existingLinkedAccount) => {
        // We want to make sure the request is for a valid account that is in
        // your wallet
        if (existingLinkedAccount == null) {
          return errAsync(
            new InvalidParametersError(
              `Account ${accountAddress} is not linked to your data wallet`,
            ),
          );
        }

        return this.contextProvider.getContext();
      })
      .andThen((context) => {
        if (
          context.dataWalletAddress == null ||
          context.dataWalletKey == null
        ) {
          return errAsync(
            new UninitializedError(
              "Core must be initialized first before you can remove an account",
            ),
          );
        }

        // Add the account to the data wallet
        return this.accountRepo
          .removeAccount(accountAddress)
          .andThen(() => {
            // We need to post a backup immediately upon adding an account, so that we don't lose access
            return this.dataWalletPersistence.postBackups();
          })
          .map(() => {
            // Notify the outside world of what we did
            context.publicEvents.onAccountRemoved.next(
              new LinkedAccount(chain, accountAddress),
            );
          });
      });
  }

  public getAccounts(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<LinkedAccount[], UnauthorizedError | PersistenceError> {
    // TODO: restore this once we have a way to request and grant permissions.
    // return this.permissionUtils
    //   .assureSourceDomainHasPermission(
    //     sourceDomain,
    //     EDataWalletPermission.ReadLinkedAccounts,
    //   )
    //   .andThen(() => {
    //     return this.accountRepo.getAccounts();
    //   });
    return this.accountRepo.getAccounts();
  }

  public getAccountBalances(): ResultAsync<TokenBalance[], PersistenceError> {
    return this.balanceRepo.getAccountBalances();
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

  public getSiteVisitsMap(): ResultAsync<SiteVisitsMap, PersistenceError> {
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

  protected filterInvalidDomains(
    domains: SiteVisit[],
  ): ResultAsync<SiteVisit[], never> {
    return this.configProvider.getConfig().map(({ domainFilter }) => {
      const invalidDomains = new RegExp(domainFilter);

      return domains.filter(({ url }) => !invalidDomains.test(url));
    });
  }

  protected activateAuthenticatedStorage(
    dataWalletAccount: ExternallyOwnedAccount,
  ): ResultAsync<ExternallyOwnedAccount, PersistenceError> {
    return this.authenticatedStorageRepo
      .getCredentials()
      .andThen((credentials) => {
        if (credentials == null) {
          return okAsync(undefined);
        }
        return this.authenticatedStorageRepo.activateAuthenticatedStorage(
          credentials,
        );
      })
      .map(() => {
        return dataWalletAccount;
      });
  }

  protected validateSignatureForAddress(
    accountAddress: AccountAddress,
    signature: Signature,
    message: string,
    chain: EChain,
  ): ResultAsync<void, InvalidSignatureError | UnsupportedLanguageError> {
    return this.dataWalletUtils
      .verifySignature(chain, accountAddress, signature, message)
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

  protected validateTypedDataSignatureForAddress(
    accountAddress: AccountAddress,
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
    signature: Signature,
    chain: EChain,
  ): ResultAsync<void, InvalidSignatureError> {
    const chainInfo = getChainInfoByChain(chain);

    if (chainInfo.chainTechnology != EChainTechnology.EVM) {
      return errAsync(
        new InvalidSignatureError(
          "Typed data signatures are only supported on EVM chains",
        ),
      );
    }
    return this.dataWalletUtils
      .verifyTypedDataSignature(
        accountAddress,
        domain,
        types,
        value,
        signature,
        chain,
      )
      .andThen((verified) => {
        if (verified) {
          return okAsync(undefined);
        }

        return errAsync(
          new InvalidSignatureError(
            `Provided signature from account address ${accountAddress} on chain ${chain} for typed data is invalid`,
          ),
        );
      });
  }
}
