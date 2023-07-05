import { okAsync, ResultAsync } from "neverthrow";

import { DataWalletPrompt } from "@test-harness/prompts/DataWalletPrompt.js";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";

export class DiscordPrompt extends DataWalletPrompt {
  public start(): ResultAsync<void, Error> {
    const choices = [
      { name: "Cancel", value: "Cancel" },
      { name: "Add Code", value: "code" },
      { name: "Add a refresh token", value: "refreshToken" },
    ];

    return inquiryWrapper([
      {
        type: "list",
        name: "discorPromptSelector",
        message: "Choose action",
        choices: choices,
      },
    ])
      .andThen((answers) => {
        switch (answers.discorPromptSelector) {
          case "Cancel":
            break;
          case "code":
            // TODO initialize with code
            break;

          case "refreshToken":
            // TODO initialize with refreshToken
            break;
        }
        return okAsync(undefined);
      })
      .map(() => {
        console.log(`discord profiles loaded`);
      })
      .mapErr((e) => {
        console.error(e);
        return e;
      });
  }
}
