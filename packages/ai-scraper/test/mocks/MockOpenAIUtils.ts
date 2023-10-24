import { LLMError } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import OpenAI from "openai";
import {
  ChatCompletion,
  CompletionCreateParamsNonStreaming,
} from "openai/resources/chat";

import { OpenAIUtils } from "@ai-scraper/implementations/index.js";
import { chatCompletion } from "@ai-scraper-test/mocks/testValues.js";
// import { chatCompletion } from "@ai-scraper-test/mocks/testValues.js";

export class MockOpenAIUtils extends OpenAIUtils {
  public createChatCompletionNonStreaming(
    client: OpenAI,
    params: CompletionCreateParamsNonStreaming,
  ): ResultAsync<ChatCompletion, LLMError> {
    const chatCompletion2: ChatCompletion = {
      id: chatCompletion.id,
      object: chatCompletion.object,
      created: chatCompletion.created,
      model: params.model,
      choices: chatCompletion.choices,
    };
    return okAsync(chatCompletion2);
  }
}
