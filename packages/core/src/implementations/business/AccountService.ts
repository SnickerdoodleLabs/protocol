/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AESEncryptedString,
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  DataWalletAddress,
  EVMAccountAddress,
  EVMPrivateKey,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  InvalidSignatureError,
  LanguageCode,
  PersistenceError,
  Signature,
  UninitializedError,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IAccountService } from "@core/interfaces/business";
import {
  ILoginRegistryRepository,
  ILoginRegistryRepositoryType,
} from "@core/interfaces/data";
import { EthereumAccount, CoreContext } from "@core/interfaces/objects";
import {
  IContextProvider,
  IContextProviderType,
  IDataWalletUtils,
  IDataWalletUtilsType,
} from "@core/interfaces/utilities";

@injectable()
export class AccountService implements IAccountService {
  public constructor(
    @inject(ILoginRegistryRepositoryType)
    protected loginRegistryRepo: ILoginRegistryRepository,
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IDataWalletUtilsType) protected dataWalletUtils: IDataWalletUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
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
    | PersistenceError
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | UnsupportedLanguageError
    | InvalidSignatureError
    | AjaxError
  > {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.loginRegistryRepo.getCrumb(accountAddress, languageCode),
    ]).andThen(([context, encryptedDataWalletKey]) => {
      // You can't unlock if we're already unlocked!
      if (context.dataWalletAddress != null || context.unlockInProgress) {
        // TODO: Need to consider the error type here, I'm getting lazy
        return errAsync(new InvalidSignatureError());
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
            );
          }
          return this.unlockExistingWallet(encryptedDataWalletKey, signature);
        })
        .andThen((account) => {
          // The account address in account is just a generic EVMAccountAddress,
          // we need to cast it to a DataWalletAddress, since in this case, that's
          // what it is.
          context.dataWalletAddress = DataWalletAddress(account.accountAddress);
          context.dataWalletKey = account.privateKey;
          context.unlockInProgress = false;

          // We can update the context and provide the key to the persistence in one step
          return ResultUtils.combine([
            this.dataWalletPersistence.unlock(account.privateKey),
            this.contextProvider.setContext(context),
          ]);
        })
        .andThen(() => {
          // Need to emit some events
          context.publicEvents.onInitialized.next(context.dataWalletAddress!);

          // Placeholder for any action we want to do to verify the account
          // is in the data wallet or other sanity checking
          return okAsync(undefined);
        });
    });
  }

  protected createDataWallet(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    EthereumAccount,
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
          return this.loginRegistryRepo.addCrumb(
            dataWalletAddress,
            accountAddress,
            encryptedDataWallet,
            languageCode,
            dataWalletKey,
          );
        })
        .map(() => {
          return new EthereumAccount(
            this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
              dataWalletKey,
            ),
            dataWalletKey,
          );
        });
    });
  }

  protected unlockExistingWallet(
    encryptedDataWalletKey: AESEncryptedString,
    signature: Signature,
  ): ResultAsync<
    EthereumAccount,
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
        return new EthereumAccount(
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
    | ConsentContractError
    | AjaxError
  > {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.loginRegistryRepo.getCrumb(accountAddress, languageCode),
    ]).andThen(([context, existingCrumb]) => {
      if (
        context.dataWalletAddress == null ||
        context.sourceEntropy == null ||
        context.dataWalletKey == null
      ) {
        return errAsync(
          new UninitializedError(
            "Must be logged in first before you can add an additional account",
          ),
        );
      }

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
          return this.loginRegistryRepo.addCrumb(
            context.dataWalletAddress!,
            accountAddress,
            encryptedDataWalletKey,
            languageCode,
            context.dataWalletKey!,
          );
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
}
