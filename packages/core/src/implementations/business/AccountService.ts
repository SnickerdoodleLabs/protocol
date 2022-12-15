/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ICryptoUtils,
  ICryptoUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";
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
  IChainTransaction,
  ConsentContractError,
  CrumbsContractError,
  DataWalletAddress,
  EChain,
  EVMAccountAddress,
  EVMPrivateKey,
  EVMTransaction,
  EVMTransactionFilter,
  ExternallyOwnedAccount,
  ICrumbContent,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IEVMBalance,
  IEVMNFT,
  InvalidParametersError,
  InvalidSignatureError,
  LanguageCode,
  LinkedAccount,
  MinimalForwarderContractError,
  PersistenceError,
  Signature,
  SiteVisit,
  TokenId,
  TokenUri,
  UninitializedError,
  UnsupportedLanguageError,
  URLString,
  EarnedReward,
  DataWalletBackupID,
} from "@snickerdoodlelabs/objects";
import {
  forwardRequestTypes,
  getMinimalForwarderSigningDomain,
} from "@snickerdoodlelabs/signature-verification";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IAccountService } from "@core/interfaces/business/index.js";
import {
  ICrumbsRepository,
  ICrumbsRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory/index.js";
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
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(ICrumbsRepositoryType)
    protected crumbsRepo: ICrumbsRepository,
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IDataWalletUtilsType) protected dataWalletUtils: IDataWalletUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IContractFactoryType) protected contractFactory: IContractFactory,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

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
                return this.dataWalletPersistence.addAccount(
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
            return this.dataWalletPersistence.addAccount(
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
  > {
    // First, let's do some validation and make sure that the signature is actually for the account
    return this.validateSignatureForAddress(
      accountAddress,
      signature,
      languageCode,
      chain,
    ).andThen(() => {
      return this.dataWalletPersistence
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
                return errAsync(new UninitializedError());
              }

              // Remove the crumb
              return this.removeCrumb(derivedEVMAccount, crumbTokenId)
                .andThen(() => {
                  // Add the account to the data wallet
                  return this.dataWalletPersistence.removeAccount(
                    accountAddress,
                  );
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

  public getAccounts(): ResultAsync<LinkedAccount[], PersistenceError> {
    return this.dataWalletPersistence.getAccounts();
  }

  public getAccountBalances(): ResultAsync<IEVMBalance[], PersistenceError> {
    return this.dataWalletPersistence.getAccountBalances();
  }

  public getAccountNFTs(): ResultAsync<IEVMNFT[], PersistenceError> {
    return this.dataWalletPersistence.getAccountNFTs();
  }

  public getEarnedRewards(): ResultAsync<EarnedReward[], PersistenceError> {
    return this.dataWalletPersistence.getEarnedRewards();
  }

  public addEarnedRewards(
    rewards: EarnedReward[],
  ): ResultAsync<void, PersistenceError> {
    return this.dataWalletPersistence.addEarnedRewards(rewards);
  }

  public getTranactions(
    filter?: EVMTransactionFilter,
  ): ResultAsync<EVMTransaction[], PersistenceError> {
    return this.dataWalletPersistence.getEVMTransactions(filter);
  }

  // public getTransactionsArray(): ResultAsync<{ chainId: ChainId; items: EVMTransaction[] | null }[], PersistenceError> {
  //   return this.dataWalletPersistence.getTransactionsArray();
  // }

  public getTransactionsArray(): ResultAsync<
    IChainTransaction[],
    PersistenceError
  > {
    return this.dataWalletPersistence.getTransactionsArray();
  }

  public getSiteVisitsMap(): ResultAsync<
    Map<URLString, number>,
    PersistenceError
  > {
    return this.dataWalletPersistence.getSiteVisitsMap();
  }
  public addSiteVisits(
    siteVisits: SiteVisit[],
  ): ResultAsync<void, PersistenceError> {
    return this.dataWalletPersistence.addSiteVisits(siteVisits);
  }
  public getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError> {
    return this.dataWalletPersistence.getSiteVisits();
  }

  public addEVMTransactions(
    transactions: EVMTransaction[],
  ): ResultAsync<void, PersistenceError> {
    return this.dataWalletPersistence.addEVMTransactions(transactions);
  }

  public postBackups(): ResultAsync<DataWalletBackupID[], PersistenceError> {
    return this.dataWalletPersistence.postBackups();
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
  > {
    const derivedEVMAccountAddress =
      this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(derivedEVMKey);

    // We need to get a nonce for this account address from the forwarder contract
    return ResultUtils.combine([
      this.contractFactory.factoryMinimalForwarderContract(),
      this.contractFactory.factoryCrumbsContract(),
      this.cryptoUtils.getTokenId(),
      this.configProvider.getConfig(),
    ]).andThen(([minimalForwarder, crumbsContract, crumbId, config]) => {
      return minimalForwarder
        .getNonce(derivedEVMAccountAddress)
        .andThen((nonce) => {
          this.logUtils.info(
            `Creating new crumb token for derived account ${derivedEVMAccountAddress} with token ID ${crumbId}`,
          );
          // Create the crumb content
          const crumbContent = TokenUri(
            JSON.stringify({
              [languageCode]: {
                d: encryptedDataWalletKey.data,
                iv: encryptedDataWalletKey.initializationVector,
              },
            } as ICrumbContent),
          );
          const callData = crumbsContract.encodeCreateCrumb(
            crumbId,
            crumbContent,
          );

          // Create a metatransaction request
          const value = {
            to: crumbsContract.contractAddress, // Contract address for the metatransaction
            from: derivedEVMAccountAddress, // EOA to run the transaction as
            value: BigNumber.from(0), // The amount of doodle token to pay. Should be 0.
            gas: BigNumber.from(10000000), // gas
            nonce: BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
            data: callData, // The actual bytes of the request, encoded as a hex string
          } as IMinimalForwarderRequest;

          // Sign the metatransaction request with the derived EVM key
          return this.cryptoUtils
            .signTypedData(
              getMinimalForwarderSigningDomain(
                config.controlChainInformation.chainId,
                config.controlChainInformation.metatransactionForwarderAddress,
              ),
              forwardRequestTypes,
              value,
              derivedEVMKey,
            )
            .andThen((metatransactionSignature) => {
              return this.insightPlatformRepo.executeMetatransaction(
                derivedEVMAccountAddress,
                crumbsContract.contractAddress,
                nonce,
                BigNumberString(BigNumber.from(0).toString()), // The amount of doodle token to pay. Should be 0.
                BigNumberString(BigNumber.from(10000000).toString()), // gas
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
              crumbsContract
                .tokenURI(crumbId)
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
  > {
    // We need to get a nonce for this account address from the forwarder contract
    return ResultUtils.combine([
      this.contractFactory.factoryMinimalForwarderContract(),
      this.contractFactory.factoryCrumbsContract(),
      this.configProvider.getConfig(),
    ]).andThen(([minimalForwarder, crumbsContract, config]) => {
      return minimalForwarder
        .getNonce(derivedEVMAccount.accountAddress)
        .andThen((nonce) => {
          const callData = crumbsContract.encodeBurnCrumb(crumbId);

          // Create a metatransaction request
          const value = {
            to: crumbsContract.contractAddress, // Contract address for the metatransaction
            from: derivedEVMAccount.accountAddress, // EOA to run the transaction as
            value: BigNumber.from(0), // The amount of doodle token to pay. Should be 0.
            gas: BigNumber.from(10000000), // gas
            nonce: BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
            data: callData, // The actual bytes of the request, encoded as a hex string
          } as IMinimalForwarderRequest;

          // Sign the metatransaction request with the derived EVM key
          return this.cryptoUtils
            .signTypedData(
              getMinimalForwarderSigningDomain(
                config.controlChainInformation.chainId,
                config.controlChainInformation.metatransactionForwarderAddress,
              ),
              forwardRequestTypes,
              value,
              derivedEVMAccount.privateKey,
            )
            .andThen((metatransactionSignature) => {
              return this.insightPlatformRepo.executeMetatransaction(
                derivedEVMAccount.accountAddress,
                crumbsContract.contractAddress,
                nonce,
                BigNumberString(BigNumber.from(0).toString()), // The amount of doodle token to pay. Should be 0.
                BigNumberString(BigNumber.from(10000000).toString()), // gas
                callData,
                metatransactionSignature,
                derivedEVMAccount.privateKey,
                config.defaultInsightPlatformBaseUrl,
              );
            });
        });
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
}
