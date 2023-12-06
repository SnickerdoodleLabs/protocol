import "reflect-metadata";

import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { LLMError, LLMResponse, Prompt } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  ChatGPTRepository,
  LLMProductMetaUtilsChatGPT,
  LLMPurchaseHistoryUtilsChatGPT,
  OpenAIUtils,
  PromptDirector,
} from "@ai-scraper/implementations";
import { PromptBuilderFactory } from "@ai-scraper/implementations/business/utils/PromptBuilderFactory";
import {
  MockLogUtils,
  MockOpenAIUtils,
  chatCompletion,
  chatGPTPurchaseHistoryResponse,
  purchaseHistoryData,
} from "@ai-scraper-test/mocks/index.js";
import { MockScraperConfigProvider } from "@ai-scraper-test/mocks/MockScraperConfigProvider";

class Mocks {
  public logUtils = new MockLogUtils();
  public configProvider = new MockScraperConfigProvider();
  public mockOpenAiUtils = new MockOpenAIUtils(); // cannot use mock for all the tests as response structure is not strictconst openAIUtils = new OpenAIUtils();

  public openAIUtils = new OpenAIUtils();
  public timeUtils = new TimeUtils();
  public purchaseHistoryLLMUtils = new LLMPurchaseHistoryUtilsChatGPT(
    this.timeUtils,
    this.logUtils,
  );
  public productMetaLLMUtils = new LLMProductMetaUtilsChatGPT(
    this.timeUtils,
    this.logUtils,
  );
  public promptBuilderFactory = new PromptBuilderFactory();
  public promptDirector = new PromptDirector(
    this.promptBuilderFactory,
    this.purchaseHistoryLLMUtils,
    this.productMetaLLMUtils,
  );

  public factoryWithMockedClient(): ChatGPTRepository {
    return new ChatGPTRepository(
      this.configProvider,
      this.logUtils,
      this.mockOpenAiUtils,
    );
  }
  public factoryWithRealClient(): ChatGPTRepository {
    return new ChatGPTRepository(
      this.configProvider,
      this.logUtils,
      this.openAIUtils,
    );
  }
}

describe("ChatGPTRepository with Mock OpenAI api", () => {
  test("executePrompt: Hello world", async () => {
    // Arrange
    const mocks = new Mocks();
    const provider = mocks.factoryWithMockedClient();
    const prompt = Prompt("Hello world");
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

describe("ChatGPTRepository with Real OpenAI api", () => {
  test.skip(
    "executePrompt: ",
    async () => {
      // Arrange
      const mocks = new Mocks();
      const provider = mocks.factoryWithRealClient();
      const promptDirector = mocks.promptDirector;

      // Act
      const promptRes = await promptDirector.makePurchaseHistoryPrompt(
        purchaseHistoryData,
      );
      const result = await provider.executePrompt(promptRes._unsafeUnwrap());

      // Assert
      expect(result.isOk()).toBe(true);
      const response = result._unsafeUnwrap();
      expect(response.length).toBeGreaterThan(
        chatGPTPurchaseHistoryResponse.length / 2,
      );
    },
    60 * 1000, // 1 minute, but chat gpt can take as much as 20 minutes
  );
});
