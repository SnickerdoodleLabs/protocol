/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AESEncryptedString,
  AjaxError,
  BigNumberString,
  BlockchainProviderError,
  ChainId,
  ConsentContractError,
  CrumbsContractError,
  DataWalletAddress,
  EVMAccountAddress,
  EVMPrivateKey,
  EVMTransaction,
  EVMTransactionFilter,
  ExternallyOwnedAccount,
  HexString,
  ICrumbContent,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IEVMBalance,
  IEVMNFT,
  InvalidParametersError,
  InvalidSignatureError,
  LanguageCode,
  MetatransactionSignatureRequest,
  PersistenceError,
  Signature,
  SiteVisit,
  TokenId,
  TokenUri,
  UninitializedError,
  UnsupportedLanguageError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IAccountService } from "@core/interfaces/business";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
  ICrumbsRepository,
  ICrumbsRepositoryType,
} from "@core/interfaces/data";
import { CoreContext } from "@core/interfaces/objects";
import {
  IContextProvider,
  IContextProviderType,
  IDataWalletUtils,
  IDataWalletUtilsType,
} from "@core/interfaces/utilities";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory";

@injectable()
export class AccountService implements IAccountService {
  public constructor(
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(ICrumbsRepositoryType)
    protected loginRegistryRepo: ICrumbsRepository,
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IDataWalletUtilsType) protected dataWalletUtils: IDataWalletUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IContractFactoryType) protected contractFactory: IContractFactory,
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
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | PersistenceError
    | UnsupportedLanguageError
    | InvalidSignatureError
    | AjaxError
    | ConsentContractError
  > {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.loginRegistryRepo.getCrumb(accountAddress, languageCode),
    ])
      .andThen(([context, encryptedDataWalletKey]) => {
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
              return this.createDataWallet(
                accountAddress,
                signature,
                languageCode,
                context,
              );
            }
            return this.unlockExistingWallet(encryptedDataWalletKey, signature);
          })
          .andThen((account) => {
            console.log(
              "Data wallet address initialized: ",
              account.accountAddress,
            );
            // The account address in account is just a generic EVMAccountAddress,
            // we need to cast it to a DataWalletAddress, since in this case, that's
            // what it is.
            context.dataWalletAddress = DataWalletAddress(
              account.accountAddress,
            );
            context.dataWalletKey = account.privateKey;
            context.unlockInProgress = false;

            // We can update the context and provide the key to the persistence in one step
            return ResultUtils.combine([
              this.dataWalletPersistence.unlock(account.privateKey),
              this.contextProvider.setContext(context),
            ]);
          })
          .andThen(() => {
            // Need to add the account if this was the first time;
            // Doing it this way because I have to make sure the persistence is
            // unlocked first.
            return this.dataWalletPersistence.addAccount(accountAddress);
          })
          .andThen(() => {
            // Need to emit some events
            context.publicEvents.onInitialized.next(context.dataWalletAddress!);

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
  }

  protected createDataWallet(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    context: CoreContext,
  ): ResultAsync<
    ExternallyOwnedAccount,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | AjaxError
  > {
    return ResultUtils.combine([
      this.dataWalletUtils.createDataWalletKey(),
      this.dataWalletUtils.deriveEncryptionKeyFromSignature(signature),
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

          // Need to get a signature on the add crumb metatransaction
          return this.addCrumbMetatransaction(
            accountAddress,
            context,
            encryptedDataWallet,
            languageCode,
            dataWalletAddress,
            dataWalletKey,
          );
        })
        .map(() => {
          return new ExternallyOwnedAccount(
            this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
              dataWalletKey,
            ),
            dataWalletKey,
          );
        });
    });
  }

  protected addCrumbMetatransaction(
    accountAddress: EVMAccountAddress,
    context: CoreContext,
    encrypted: AESEncryptedString,
    languageCode: LanguageCode,
    dataWalletAddress: DataWalletAddress,
    dataWalletKey: EVMPrivateKey,
  ): ResultAsync<
    TokenId,
    BlockchainProviderError | UninitializedError | AjaxError
  > {
    return ResultUtils.combine([
      this.cryptoUtils.getTokenId(),
      this.contractFactory.factoryCrumbsContract(),
    ]).andThen(([crumbId, crumbsContract]) => {
      // Create the crumb content
      const crumbContent = TokenUri(
        JSON.stringify({
          [languageCode]: {
            d: encrypted.data,
            iv: encrypted.initializationVector,
          },
        } as ICrumbContent),
      );
      const callData = crumbsContract.encodeCreateCrumb(crumbId, crumbContent);

      return ResultAsync.fromSafePromise<[Signature, BigNumberString], never>(
        new Promise<[Signature, BigNumberString]>((resolve) => {
          context.publicEvents.onMetatransactionSignatureRequested.next(
            new MetatransactionSignatureRequest(
              accountAddress,
              crumbsContract.contractAddress,
              BigNumberString(BigNumber.from(0).toString()), // The amount of doodle token to pay. Should be 0.
              BigNumberString(BigNumber.from(10000000).toString()), // gas
              callData, // data
              (signature: Signature, nonce: BigNumberString) => {
                resolve([signature, nonce]);

                // Return. We should really return the result from the end of this method
                // though
                // TODO: Figure out if there is a reasonable logical path to make that happen
                return okAsync(undefined);
              },
            ),
          );
        }),
      )
        .andThen(([signature, nonce]) => {
          return this.insightPlatformRepo.executeMetatransaction(
            dataWalletAddress,
            accountAddress,
            crumbsContract.contractAddress,
            nonce,
            BigNumberString(BigNumber.from(0).toString()), // The amount of doodle token to pay. Should be 0.
            BigNumberString(BigNumber.from(10000000).toString()), // gas
            callData,
            signature,
            dataWalletKey,
          );
        })
        .map(() => {
          return crumbId;
        });
    });
  }

  protected unlockExistingWallet(
    encryptedDataWalletKey: AESEncryptedString,
    signature: Signature,
  ): ResultAsync<
    ExternallyOwnedAccount,
    BlockchainProviderError | InvalidSignatureError | UnsupportedLanguageError
  > {
    return this.dataWalletUtils
      .deriveEncryptionKeyFromSignature(signature)
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

  public addAccount(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | PersistenceError
    | CrumbsContractError
    | AjaxError
  > {
    // Normally I would call .getContext() and .getCrumb() via .combine(),
    // but .getCrumb() failed if the wallet is not unlocked- resulting
    // not in an UnitializedError as I desired, but in another, more
    // inscrutable error. So I do these inline
    return this.contextProvider.getContext().andThen((context) => {
      if (context.dataWalletAddress == null || context.dataWalletKey == null) {
        return errAsync(
          new UninitializedError(
            "Core must be unlocked first before you can add an additional account",
          ),
        );
      }

      return this.loginRegistryRepo
        .getCrumb(accountAddress, languageCode)
        .andThen((existingCrumb) => {
          if (existingCrumb != null) {
            // There is already a crumb on chain for this account; odds are the
            // account is already connected. If we want to be cool,
            // we'd double check. For right now, we'll just return, and figure
            // the job is done
            return okAsync(undefined);
          }

          return this.dataWalletUtils
            .deriveEncryptionKeyFromSignature(signature)
            .andThen((encryptionKey) => {
              // Encrypt the data wallet key with this new encryption key
              return this.cryptoUtils.encryptString(
                context.dataWalletKey!,
                encryptionKey,
              );
            })
            .andThen((encryptedDataWalletKey) => {
              // Need to get a signature on the add crumb metatransaction
              return this.addCrumbMetatransaction(
                accountAddress,
                context,
                encryptedDataWalletKey,
                languageCode,
                context.dataWalletAddress!,
                context.dataWalletKey!,
              );
            });
        })
        .andThen(() => {
          // Add the account to the data wallet
          return this.dataWalletPersistence.addAccount(accountAddress);
        })
        .map(() => {
          // Notify the outside world of what we did
          context.publicEvents.onAccountAdded.next(accountAddress);
        });
    });
  }

  public getUnlinkAccountRequest(
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    MetatransactionSignatureRequest<PersistenceError | AjaxError>,
    | PersistenceError
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | InvalidParametersError
  > {
    return this.dataWalletPersistence
      .getAccounts()
      .andThen((accounts) => {
        // Two things
        // First, we can't remove the last account from your data wallet, so we need
        // to make sure you're not doing that.
        // Second, we want to make sure the request is for a valid account that is in
        // your wallet
        if (!accounts.includes(accountAddress)) {
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
        return this.contextProvider.getContext();
      })
      .andThen((context) => {
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

        return ResultUtils.combine([
          this.loginRegistryRepo.getCrumbTokenId(accountAddress),
          this.contractFactory.factoryCrumbsContract(),
        ]).andThen(([crumbTokenId, crumbsContract]) => {
          if (crumbTokenId == null) {
            // We can't unlink an account with no crumb
            return errAsync(new UninitializedError());
          }

          const callData = crumbsContract.encodeBurnCrumb(crumbTokenId);

          return okAsync(
            new MetatransactionSignatureRequest(
              accountAddress,
              crumbsContract.contractAddress,
              BigNumberString(BigNumber.from(0).toString()), // The amount of doodle token to pay. Should be 0.
              BigNumberString(BigNumber.from(10000000).toString()), // gas
              callData, // data
              (signature: Signature, nonce: BigNumberString) => {
                // We have everything we need to do the metatransaction

                return this.insightPlatformRepo
                  .executeMetatransaction(
                    context.dataWalletAddress!, // data wallet address
                    accountAddress, // account address
                    crumbsContract.contractAddress, // contract address
                    BigNumberString(BigNumber.from(nonce).toString()),
                    BigNumberString(BigNumber.from(0).toString()), // The amount of doodle token to pay. Should be 0.
                    BigNumberString(BigNumber.from(10000000).toString()), // The amount of gas to pay.
                    callData,
                    signature,
                    context.dataWalletKey!,
                  )
                  .andThen(() => {
                    // Add the account to the data wallet
                    return this.dataWalletPersistence.removeAccount(
                      accountAddress,
                    );
                  })
                  .map(() => {
                    // Notify the outside world of what we did
                    context.publicEvents.onAccountRemoved.next(accountAddress);
                  });
              },
            ),
          );
        });
      });
  }

  public getAccounts(): ResultAsync<EVMAccountAddress[], PersistenceError> {
    return this.dataWalletPersistence.getAccounts();
  }

  public getAccountBalances(): ResultAsync<IEVMBalance[], PersistenceError> {
    return this.dataWalletPersistence.getAccountBalances();
  }

  public getAccountNFTs(): ResultAsync<IEVMNFT[], PersistenceError> {
    return this.dataWalletPersistence.getAccountNFTs();
  }

  public getTranactions(
    filter?: EVMTransactionFilter,
  ): ResultAsync<EVMTransaction[], PersistenceError> {
    return this.dataWalletPersistence.getEVMTransactions(filter);
  }

  public getTransactionsMap(): ResultAsync<
    Map<ChainId, number>,
    PersistenceError
  > {
    return this.dataWalletPersistence.getTransactionsMap();
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
}
