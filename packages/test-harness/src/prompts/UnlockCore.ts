import {
  AjaxError,
  BlockchainProviderError,
  CrumbsContractError,
  InvalidSignatureError,
  MinimalForwarderContractError,
  PersistenceError,
  UninitializedError,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { DataWalletPrompt } from "@test-harness/prompts/DataWalletPrompt.js";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { TestWallet } from "@test-harness/utilities/index.js";

export class UnlockCore extends DataWalletPrompt {
  public start(): ResultAsync<
    void,
    | UnsupportedLanguageError
    | PersistenceError
    | AjaxError
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | InvalidSignatureError
    | MinimalForwarderContractError
    | Error
  > {
    return inquiryWrapper([
      {
        type: "list",
        name: "unlockAccountSelector",
        message: "Which account do you want to unlock with?",
        choices: this.env.mocks.blockchain.accountWallets.map((wallet) => {
          return {
            name: wallet.getName(),
            value: wallet,
          };
        }),
      },
    ])
      .andThen((answers) => {
        const wallet = answers.unlockAccountSelector as TestWallet;
        return this.profile.unlock(wallet);
      })
      .mapErr((e) => {
        console.error(e);
        return e;
      });
  }
}
