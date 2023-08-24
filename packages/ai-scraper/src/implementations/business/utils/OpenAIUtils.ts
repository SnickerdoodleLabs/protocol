import { LLMError } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import OpenAI from "openai";
import {
  ChatCompletion,
  CompletionCreateParamsNonStreaming,
} from "openai/resources/chat";

import { LLMResponse } from "@ai-scraper/interfaces/index.js";

@injectable()
export class OpenAIUtils {
  public createChatCompletionNonStreaming(
    client: OpenAI,
    params: CompletionCreateParamsNonStreaming,
  ): ResultAsync<ChatCompletion, LLMError> {
    const completionResult = ResultAsync.fromPromise(
      client.chat.completions.create(params),
      (e) => new LLMError((e as Error).message, e),
    );

    return completionResult;
  }

  public parseCompletionResult(
    completionResult: ResultAsync<ChatCompletion, LLMError>,
  ): ResultAsync<LLMResponse, LLMError> {
    return completionResult.andThen((completion) => {
      const content = completion.choices[0].message.content;
      if (content == null) {
        return errAsync(new LLMError("No content in response"));
      }
      return okAsync(LLMResponse(content));
    });
  }
}
