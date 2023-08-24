import "reflect-metadata";

import { ChatGPTProvider } from "@ai-scraper/implementations";
import { Prompt, LLMResponse } from "@ai-scraper/interfaces";
import {
  MockLogUtils,
  MockOpenAIUtils,
  chatCompletion,
} from "@ai-scraper-test/mocks/index.js";
import { MockScraperConfigProvider } from "@ai-scraper-test/mocks/MockScraperConfigProvider";

class Mocks {
  public logUtils = new MockLogUtils();
  public configProvider = new MockScraperConfigProvider();
  public openAiUtils = new MockOpenAIUtils();

  constructor() {}

  public factory(): ChatGPTProvider {
    return new ChatGPTProvider(
      this.configProvider,
      this.logUtils,
      this.openAiUtils,
    );
  }
}

describe("ChatGPTProvider", () => {
  test("executePrompt", async () => {
    // Arrange
    const mocks = new Mocks();
    const provider = mocks.factory();
    const prompt = Prompt("How are you today?");
    // Act

    const result = await provider.executePrompt(prompt);

    // Assert
    expect(result.isOk()).toBe(true);
    const response = result._unsafeUnwrap();
    expect(response).toBe(
      LLMResponse(chatCompletion.choices[0].message.content!),
    );
  });
});
