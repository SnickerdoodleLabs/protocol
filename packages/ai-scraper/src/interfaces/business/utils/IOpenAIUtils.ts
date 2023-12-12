import { LLMError, LLMResponse } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import OpenAI from "openai";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat";

export interface IOpenAIUtils {
  getLLMResponseNonStreaming(
    client: OpenAI,
    params: ChatCompletionCreateParamsNonStreaming,
  ): ResultAsync<LLMResponse, LLMError>;
}
export const IOpenAIUtilsType = Symbol.for("IOpenAIUtils");
