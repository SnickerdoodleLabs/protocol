import { LLMError, LLMResponse } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import OpenAI from "openai";
import {
  ChatCompletion,
  ChatCompletionCreateParamsNonStreaming,
} from "openai/resources/chat";

@injectable()
export class OpenAIUtils {
  public getLLMResponseNonStreaming(
    client: OpenAI,
    params: ChatCompletionCreateParamsNonStreaming,
  ): ResultAsync<LLMResponse, LLMError> {
    const completionResult = ResultAsync.fromPromise(
      client.chat.completions.create(params),
      (e) => new LLMError((e as Error).message, e),
    );
    return completionResult.andThen((completion) => {
      const content = completion.choices[0].message.content;
      if (content == null) {
        return errAsync(new LLMError("No content in response"));
      }
      return okAsync(LLMResponse(content));
    });
  }
}
