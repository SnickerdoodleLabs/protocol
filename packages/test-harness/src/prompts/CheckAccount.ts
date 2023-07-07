import {
  BlockchainProviderError,
  CrumbsContractError,
  InvalidSignatureError,
  PersistenceError,
  UnauthorizedError,
  UninitializedError,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";
import { TestWallet } from "@test-harness/utilities/index.js";

export class CheckAccount extends Prompt {
  public start(): ResultAsync<
    void,
    | InvalidSignatureError
    | PersistenceError
    | BlockchainProviderError
    | UninitializedError
    | UnauthorizedError
    | UnsupportedLanguageError
    | CrumbsContractError
  > {
    return inquiryWrapper([
      {
        type: "list",
        name: "checkAccountSelector",
        message: "Which account do you want to check?",
        choices: this.mocks.blockchain.accountWallets.map((wallet) => {
          return {
            name: wallet.getName(),
            value: wallet,
          };
        }),
      },
    ])
      .andThen((answers) => {
        const wallet = answers.checkAccountSelector as TestWallet;
        // Need to get the unlock message first
        return this.dataWalletProfile
          .getSignatureForAccount(wallet)
          .andThen((signature) => {
            console.log(wallet.accountAddress, signature, wallet.chain);
            return this.core.account.getDataWalletForAccount(
              wallet.accountAddress,
              signature,
              this.mocks.languageCode,
              wallet.chain,
            );
          })
          .map((dataWalletAccount) => {
            console.log(
              `Data wallet account address for account ${wallet.accountAddress}: ${dataWalletAccount}`,
            );
          });
      })
      .mapErr((e) => {
        console.error(e);
        return e;
      });
  }
}
