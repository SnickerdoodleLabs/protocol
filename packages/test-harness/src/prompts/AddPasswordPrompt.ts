import {
  AjaxError,
  BlockchainProviderError,
  CrumbsContractError,
  InvalidSignatureError,
  MinimalForwarderContractError,
  PasswordString,
  PersistenceError,
  UnauthorizedError,
  UninitializedError,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";

export class AddPasswordPrompt extends Prompt {
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
    | UnauthorizedError
  > {
    return inquiryWrapper([
      {
        type: "input",
        name: "addPasswordInput",
        message: "Enter the new password",
      },
    ])
      .andThen((answers) => {
        const newPassword = answers.addPasswordInput as PasswordString;
        // Need to get the unlock message first
        return this.core.account.addPassword(newPassword);
      })
      .mapErr((e) => {
        console.error(e);
        return e;
      });
  }
}
