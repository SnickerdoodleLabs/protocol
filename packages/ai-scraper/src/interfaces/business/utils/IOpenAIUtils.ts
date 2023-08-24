import { LLMError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import OpenAI from "openai";
import {
  ChatCompletion,
  CompletionCreateParamsNonStreaming,
} from "openai/resources/chat";

import { LLMResponse } from "@ai-scraper/interfaces/primitives/LLMResponse.js";

export interface IOpenAIUtils {
  createChatCompletionNonStreaming(
    client: OpenAI,
    params: CompletionCreateParamsNonStreaming,
  ): ResultAsync<ChatCompletion, LLMError>;
  parseCompletionResult(
    completionResult: ResultAsync<ChatCompletion, LLMError>,
  ): ResultAsync<LLMResponse, LLMError>;
}
export const IOpenAIUtilsType = Symbol.for("IOpenAIUtils");
