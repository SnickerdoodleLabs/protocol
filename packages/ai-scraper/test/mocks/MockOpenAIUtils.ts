import { LLMError, LLMResponse } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import OpenAI from "openai";
import {
  ChatCompletion,
  CompletionCreateParamsNonStreaming,
} from "openai/resources/chat";

import { IOpenAIUtils } from "@ai-scraper/interfaces";
import { chatCompletion } from "@ai-scraper-test/mocks/testValues.js";
// import { chatCompletion } from "@ai-scraper-test/mocks/testValues.js";

export class MockOpenAIUtils implements IOpenAIUtils {
  public getLLMResponseNonStreaming(
    client: OpenAI,
    params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
  ): ResultAsync<LLMResponse, LLMError> {
    return okAsync(LLMResponse(chatCompletion.choices[0].message.content!));
  }
}
