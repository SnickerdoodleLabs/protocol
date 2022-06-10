/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BlockchainProviderError,
  DataWalletAddress,
  DerivationMask,
  EthereumAccountAddress,
  InvalidSignatureError,
  LanguageCode,
  Signature,
  UninitializedError,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IAccountService } from "@query-engine/interfaces/business";
import {
  ILoginRegistryRepository,
  ILoginRegistryRepositoryType,
} from "@query-engine/interfaces/data";
import {
  EthereumAccount,
  QueryEngineContext,
} from "@query-engine/interfaces/objects";
import {
  IContextProvider,
  IContextProviderType,
  IDerivationMaskUtils,
  IDerivationMaskUtilsType,
} from "@query-engine/interfaces/utilities";

@injectable()
export class AccountService implements IAccountService {
  public constructor(
    @inject(ILoginRegistryRepositoryType)
    protected loginRegistryRepo: ILoginRegistryRepository,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IDerivationMaskUtilsType)
    protected derivationMaskUtils: IDerivationMaskUtils,
  ) {}

  public getLoginMessage(
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

  public login(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    BlockchainProviderError | InvalidSignatureError | UnsupportedLanguageError
  > {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.loginRegistryRepo.getDerivationMask(accountAddress, languageCode),
    ]).andThen(([context, derivationMask]) => {
      // You can't login if we're already logged in!
      if (context.dataWalletAddress != null || context.loginInProgress) {
        // TODO: Need to consider the error type here, I'm getting lazy
        return errAsync(new InvalidSignatureError());
      }

      // Need to update the context
      context.loginInProgress = true;
      return this.contextProvider
        .setContext(context)
        .andThen(() => {
          if (derivationMask == null) {
            // We're trying to login for the first time!
            return this.firstLogin(accountAddress, signature, languageCode);
          }
          return this.subsequentLogin(derivationMask, signature);
        })
        .andThen(({ account, entropy }) => {
          // The account address in account is just a generic EthereumAccountAddress,
          // we need to cast it to a DataWalletAddress, since in this case, that's
          // what it is.
          context.dataWalletAddress = DataWalletAddress(account.accountAddress);
          context.dataWalletKey = account.privateKey;
          context.sourceEntropy = entropy;
          context.loginInProgress = false;

          return this.contextProvider.setContext(context);
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

  protected firstLogin(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    AccountEntropyPair,
    BlockchainProviderError | InvalidSignatureError | UnsupportedLanguageError
  > {
    return this.derivationMaskUtils
      .getRandomDerivationMask()
      .andThen((newDerivationMask) => {
        // Combine the mask with the signature to get the Source Entropy
        return this.derivationMaskUtils
          .calculateSourceEntropy(signature, newDerivationMask)
          .andThen((sourceEntropy) => {
            // Get the derived key
            return this.derivationMaskUtils
              .getEthereumAccountFromEntropy(sourceEntropy)
              .andThen((account) => {
                // The account object has the address and the private key
                // We need to store the derivation mask, and the key and data
                // wallet address in the context

                // The account address in account is just a generic EthereumAccountAddress,
                // we need to cast it to a DataWalletAddress, since in this case, that's
                // what it is.
                return this.loginRegistryRepo
                  .addDerivationMask(
                    accountAddress,
                    languageCode,
                    newDerivationMask,
                  )
                  .map(() => {
                    return new AccountEntropyPair(account, sourceEntropy);
                  });
              });
          });
      });
  }

  protected subsequentLogin(
    derivationMask: DerivationMask,
    signature: Signature,
  ): ResultAsync<
    AccountEntropyPair,
    BlockchainProviderError | InvalidSignatureError | UnsupportedLanguageError
  > {
    return this.derivationMaskUtils
      .calculateSourceEntropy(signature, derivationMask)
      .andThen((sourceEntropy) => {
        // Get the derived key
        return this.derivationMaskUtils
          .getEthereumAccountFromEntropy(sourceEntropy)
          .map((account) => {
            return new AccountEntropyPair(account, sourceEntropy);
          });
      });
  }

  public addAccount(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | InvalidSignatureError
    | UninitializedError
    | UnsupportedLanguageError
  > {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.loginRegistryRepo.getDerivationMask(accountAddress, languageCode),
    ]).andThen(([context, existingDerivationMask]) => {
      if (context.dataWalletAddress == null || context.sourceEntropy == null) {
        return errAsync(
          new UninitializedError(
            "Must be logged in first before you can add an additional account",
          ),
        );
      }

      if (existingDerivationMask != null) {
        // There is already a mask on chain for this account; odds are the
        // account is already connected. If we want to be cool,
        // we'd double check. For right now, we'll just return, and figure
        // the job is done
        return okAsync(undefined);
      }

      // Calculate the derivation mask that will convert this new signature
      // to the existing source entropy
      return this.derivationMaskUtils
        .calculateDerivationMask(signature, context.sourceEntropy)
        .andThen((derivationMask) => {
          // Need to store the new derivation mask
          return this.loginRegistryRepo.addDerivationMask(
            accountAddress,
            languageCode,
            derivationMask,
          );
        })
        .andThen((_tokenId) => {
          // Add the account to the data wallet
          // TODO
          return okAsync(undefined);
        })
        .map(() => {
          // Notify the outside world of what we did
          context.publicEvents.onAccountAdded.next(accountAddress);
        });
    });
  }
}

class AccountEntropyPair {
  public constructor(public account: EthereumAccount, public entropy: string) {}
}
