import {
  BlockchainProviderError,
  CrumbsContractError,
  PasswordString,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";

export class RemovePasswordPrompt extends Prompt {
  public start(): ResultAsync<
    void,
    | PersistenceError
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | Error
  > {
    return inquiryWrapper([
      {
        type: "password",
        name: "removePasswordInput",
        message: "Enter password",
      },
    ])
      .andThen((answers) => {
        const password = answers.removePasswordInput as PasswordString;

        return this.core.account.removePassword(password).map(() => {
          console.log(`Removed password!`);
        });
      })
      .mapErr((e) => {
        console.error(e);
        return e;
      });
  }
}
