import "reflect-metadata";
import OpenAI from "openai";
import {
  CompletionCreateParamsNonStreaming,
  CreateChatCompletionRequestMessage,
} from "openai/resources/chat/completions";

import { OpenAIUtils } from "@ai-scraper/implementations";
import { scraperConfig } from "@ai-scraper-test/mocks/index.js";

/***
 * We will make actual api calls to OpenAI in this test.
 */

function makeClient() {
  const clientOptions = {
    apiKey: scraperConfig.scraper.OPENAI_API_KEY,
    timeout: scraperConfig.scraper.timeout,
  };
  return new OpenAI(clientOptions);
}

describe("OpenAIUtils", () => {
  test("createChatCompletionNonStreaming", async () => {
    // Arrange
    const utils = new OpenAIUtils();
    const client = makeClient();

    const message: CreateChatCompletionRequestMessage[] = [
      { role: "system", content: "You are an helpful assistant." },
      {
        role: "user",
        content:
          "How many months there are in an year? Respond with a number only.",
      },
    ];
    const params: CompletionCreateParamsNonStreaming = {
      model: "gpt-3.5-turbo",
      messages: message,
      temperature: 0.1,
    };

    // Act

    const completionResult = utils.createChatCompletionNonStreaming(
      client,
      params,
    );
    const completion = await utils.parseCompletionResult(completionResult);

    // Assert
    expect(completion.isOk()).toBe(true);
    const response = completion._unsafeUnwrap();
    expect(response).toBe("12");
  });
});
