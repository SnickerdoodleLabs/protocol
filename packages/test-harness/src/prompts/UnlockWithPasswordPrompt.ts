import {
  AjaxError,
  BlockchainProviderError,
  CrumbsContractError,
  InvalidSignatureError,
  MinimalForwarderContractError,
  PasswordString,
  PersistenceError,
  UninitializedError,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { DataWalletPrompt } from "@test-harness/prompts/DataWalletPrompt.js";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";

export class UnlockWithPasswordPrompt extends DataWalletPrompt {
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
        type: "password",
        name: "unlockWithPasswordInput",
        message: "Enter password",
      },
    ])
      .andThen((answers) => {
        const password = answers.unlockWithPasswordInput as PasswordString;
        return this.profile.unlockWithPassword(password);
      })
      .mapErr((e) => {
        console.error(e);
        return e;
      });
  }
}
