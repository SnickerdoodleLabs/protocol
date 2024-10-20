import {
  InvalidSignatureError,
  PersistenceError,
  UnauthorizedError,
  UninitializedError,
  UnsupportedLanguageError,
  InvalidParametersError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import { TestWallet } from "@test-harness/utilities/index.js";

export class AddAccount extends Prompt {
  public start(): ResultAsync<
    void,
    | PersistenceError
    | UnauthorizedError
    | InvalidParametersError
    | UninitializedError
    | UnsupportedLanguageError
    | InvalidSignatureError
  > {
    return this.core.account
      .getAccounts(undefined)
      .andThen((linkedAccounts) => {
        const addableAccounts = this.mocks.blockchain.accountWallets.filter(
          (aw) => {
            const linkedAccount = linkedAccounts.find((la) => {
              return la.sourceAccountAddress == aw.accountAddress;
            });
            return linkedAccount == null;
          },
        );
        return inquiryWrapper([
          {
            type: "list",
            name: "addAccountSelector",
            message: "Which account do you want to add?",
            choices: addableAccounts.map((wallet) => {
              return {
                name: wallet.getName(),
                value: wallet,
              };
            }),
          },
        ]);
      })

      .andThen((answers) => {
        const wallet = answers.addAccountSelector as TestWallet;
        // Need to get the add account message first
        return this.dataWalletProfile
          .getSignatureForAccount(wallet)
          .andThen((signature) => {
            return this.core.account.addAccount(
              wallet.accountAddress,
              signature,
              this.mocks.languageCode,
              wallet.chain,
              undefined,
            );
          });
      })
      .mapErr((e) => {
        console.error(e);
        return e;
      });
  }
}
