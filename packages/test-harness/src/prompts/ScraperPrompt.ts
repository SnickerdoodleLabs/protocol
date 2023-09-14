import { Container } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import {
  IConfigProvider,
  IConfigProviderType,
} from "packages/core/src/interfaces/utilities";

import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";

export class ScraperPrompt extends Prompt {
  public start(): ResultAsync<void, Error> {
    const choices = [
      { name: "Cancel", value: "Cancel" },
      { name: "Add OPENAI_API_KEY", value: "OPENAI_API_KEY" },
      { name: "classify URL", value: "classifyURL" },
      { name: "scrape a page", value: "scrape" },
    ];

    return inquiryWrapper([
      {
        type: "list",
        name: "scraperPromptSelector",
        message: "Choose action",
        choices: choices,
      },
    ])
      .andThen((answers) => {
        switch (answers.scraperPromptSelector) {
          case "OPENAI_API_KEY":
            // TODO initialize with OPENAI_API_KEY

            const choice = [
              {
                type: "input",
                name: "OPENAI_API_KEY",
                message: "Enter your OpenAI API key",
              },
            ];
            return inquiryWrapper(choice).andThen((answers) => {
              const apiKey = answers.OPENAI_API_KEY;
              const iocContainer = this.core["iocContainer"] as Container;
              const configProvider =
                iocContainer.get<IConfigProvider>(IConfigProviderType);
              configProvider.setConfigOverrides({
                scraper: {
                  OPENAI_API_KEY: apiKey,
                  timeout: 5 * 60 * 1000, // 5 minutes
                },
              });
              return okAsync(undefined);
            });
          case "classifyURL":
            // TODO initialize with classifyURL
            break;
          case "scrape":
            // TODO initialize with scrape
            break;
        }
        return okAsync(undefined); //going back
      })
      .mapErr((e) => {
        console.error(e);
        return e;
      })
      .map(() => {});
  }
}
