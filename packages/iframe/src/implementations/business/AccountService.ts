import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  AccountAddress,
  EChain,
  ISnickerdoodleCore,
  LanguageCode,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IAccountService } from "@core-iframe/interfaces/business/index";
import {
  IBlockchainProviderRepository,
  IBlockchainProviderRepositoryType,
} from "@core-iframe/interfaces/data/index";
import { IFrameConfig } from "@core-iframe/interfaces/objects/index";
import {
  IConfigProvider,
  IConfigProviderType,
  ICoreProvider,
  ICoreProviderType,
} from "@core-iframe/interfaces/utilities/index";

@injectable()
export class AccountService implements IAccountService {
  public constructor(
    @inject(IBlockchainProviderRepositoryType)
    protected blockchainProviderRepo: IBlockchainProviderRepository,
    @inject(ICoreProviderType) protected coreProvider: ICoreProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public handleAddAccountSuggestion(
    accountAddress: AccountAddress,
  ): ResultAsync<void, Error> {
    return this.coreProvider.getCore().andThen((core) => {
      const config = this.configProvider.getConfig();
      // Make sure the account is not already in the wallet
      return core
        .getAccounts(/*config.sourceDomain*/) // TODO: we should be requesting permissions for the source domain
        .andThen((linkedAccounts) => {
          // Check if the account that is linked to the page is linked to the data wallet
          const existingAccount = linkedAccounts.find((linkedAccount) => {
            return linkedAccount.sourceAccountAddress == accountAddress;
          });

          // Account is already linked, no need to do anything
          if (existingAccount != null) {
            this.logUtils.log(
              `Suggested new account ${accountAddress} is already linked to the data wallet. We won't pester the user.`,
            );
            return okAsync(undefined);
          }

          // The account does need to be added.
          // The provider that we have access to may be an account that is not already linked,
          // event if it is not the suggested account. In that case, we'll just link to the current
          // provider account and be done. We can't force the user to connect with a specific account
          // We'll just prompt every time we notice they haven't linked the account they are using on
          // the DApp.
          return this.blockchainProviderRepo
            .getCurrentAccount()
            .andThen((currentAccount) => {
              // Check if the account that is linked to the page is linked to the data wallet
              const existingAccount = linkedAccounts.find((linkedAccount) => {
                return linkedAccount.sourceAccountAddress == currentAccount;
              });

              if (existingAccount == null) {
                this.logUtils.log(
                  `Account ${currentAccount} is connected to the iframe but is not linked to the data wallet, linking now`,
                );
                // The current provider account is not linked, let's link it!
                return this.linkAccount(core, config);
              }

              // The current provider account is already linked, let's ask the user
              // to change the account they have linked to the iframe
              return this.blockchainProviderRepo
                .requestPermissionChange()
                .andThen((newAccountAddress) => {
                  // Check if the new account is linked to the data wallet
                  // This new account may or may not be the suggested account;
                  // we're just going to have to live with that.
                  const existingAccount = linkedAccounts.find(
                    (linkedAccount) => {
                      return (
                        linkedAccount.sourceAccountAddress == newAccountAddress
                      );
                    },
                  );

                  // Account is already linked, no need to do anything
                  if (existingAccount != null) {
                    this.logUtils.warning(
                      `User changed account to ${newAccountAddress} which is already linked to the data wallet, not going to pester further`,
                    );
                    return okAsync(undefined);
                  }
                  this.logUtils.log(
                    `User changed account to ${newAccountAddress}, linking to data wallet`,
                  );
                  return this.linkAccount(core, config);
                });
            });
        });
    });
  }

  protected linkAccount(core: ISnickerdoodleCore, config: IFrameConfig) {
    // The account is not one that is linked!
    return core.account
      .getUnlockMessage(config.languageCode, config.sourceDomain)
      .andThen((message) => {
        return ResultUtils.combine([
          this.blockchainProviderRepo.getSignature(message),
          this.blockchainProviderRepo.getCurrentChain(),
          this.blockchainProviderRepo.getCurrentAccount(),
        ]);
      })
      .andThen(([signature, chain, account]) => {
        return core.account.addAccount(
          account,
          signature,
          config.languageCode,
          chain,
          config.sourceDomain,
        );
      });
  }
}
