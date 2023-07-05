import { okAsync, ResultAsync } from "neverthrow";

import { DataWalletPrompt } from "@test-harness/prompts/DataWalletPrompt.js";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";

export class AddDiscordCodePrompt extends DataWalletPrompt {
  public start(): ResultAsync<void, Error> {
    const choices = [
      { name: "Cancel", value: "Cancel" },
      { name: "Add Code", value: "code" },
      { name: "Add a refresh token", value: "refreshToken" },
    ];

    return inquiryWrapper([
      {
        type: "input",
        name: "discordCode",
        message: "Enter authorization code",
      },
    ])
      .andThen((answers) => {
        const code = answers.discordCode;
        // TODO call discord service initialize with auth code
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
