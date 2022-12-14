import { okAsync, ResultAsync } from "neverthrow";

import { DataWalletPrompt } from "@test-harness/prompts/DataWalletPrompt.js";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";

export class SelectProfile extends DataWalletPrompt {
  public start(): ResultAsync<void, Error> {
    return this.env
      .getDataWalletProfiles()
      .andThen((profiles) => {
        // return okAsync(undefined);

        const profileChoices = profiles.map((pathInfo) => {
          return {
            name: pathInfo.name,
            value: pathInfo,
          };
        });

        const choices = [
          { name: "Cancel", value: "Cancel" },
          ...profileChoices,
        ];

        return inquiryWrapper([
          {
            type: "list",
            name: "walletProfileSelector",
            message: "Which profile do you want to load?",
            choices: choices,
          },
        ]);
      })
      .andThen((answers) => {
        if (answers.walletProfileSelector == "Cancel") {
          return okAsync(undefined);
        }

        const pathInfo = answers.walletProfileSelector as {
          name: string;
          path: string;
        };

        this.env.loadDataWalletProfile(pathInfo); // we cannot return this promise as it's halted till core is unlocked.
        return okAsync(undefined);
      })
      .map(() => {
        console.log(`profile loaded`);
      })
      .mapErr((e) => {
        console.error(e);
        return e;
      });
  }
}
