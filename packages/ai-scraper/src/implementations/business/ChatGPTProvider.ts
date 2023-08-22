import {
  get_encoding,
  encoding_for_model,
  TiktokenModel,
  Tiktoken,
} from "@dqbd/tiktoken"; // TODO should be optimized for browsers to not to load all the encodings
import { ILogUtilsType, ILogUtils } from "@snickerdoodlelabs/common-utils";
import { LLMError } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, okAsync, errAsync } from "neverthrow";
import OpenAI from "openai";

import {
  ILLMProvider,
  LLMResponse,
  Prompt,
} from "@ai-scraper/interfaces/index.js";

@injectable()
export class ChatGPTProvider implements ILLMProvider {
  private openai: OpenAI;
  private chatModel: TiktokenModel = "gpt-3.5-turbo";
  private temperature: number;
  private chatEncoder: Tiktoken;
  private timeout = 5 * 60 * 1000; // 5 minutes

  public constructor(
    @inject(ILogUtilsType)
    private logUtils: ILogUtils,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: this.timeout,
    });
    this.temperature = 0.1;
    this.chatEncoder = encoding_for_model(this.chatModel);
  }
  maxTokens(): number {
    throw new Error("Method not implemented.");
  }
  executePrompt(prompt: Prompt): ResultAsync<LLMResponse, LLMError> {
    const messages = [
      { role: "system", content: "You are an helpful assistant." },
      { role: "user", content: prompt },
    ];

    return this.chatOnce(messages);
  }

  private chatOnce(messages): ResultAsync<LLMResponse, LLMError> {
    const completionResult = ResultAsync.fromPromise(
      this.openai.chat.completions.create({
        model: this.chatModel,
        messages: messages,
        temperature: this.temperature,
        stream: false,
      }),
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
