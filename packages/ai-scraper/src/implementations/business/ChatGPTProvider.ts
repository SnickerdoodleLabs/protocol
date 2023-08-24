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
  ChatCompletion,
  CompletionCreateParamsNonStreaming,
} from "openai/resources/chat";

import {
  ILLMProvider,
  IOpenAIUtils,
  IOpenAIUtilsType,
  IScraperConfigProvider,
  IScraperConfigProviderType,
  LLMResponse,
  Prompt,
} from "@ai-scraper/interfaces/index.js";

@injectable()
export class ChatGPTProvider implements ILLMProvider {
  private chatModel: TiktokenModel = "gpt-3.5-turbo";
  private temperature: number;
  private chatEncoder: Tiktoken;
  // private timeout = 5 * 60 * 1000; // 5 minutes

  public constructor(
    @inject(IScraperConfigProviderType)
    private configProvider: IScraperConfigProvider,
    @inject(ILogUtilsType)
    private logUtils: ILogUtils,
    @inject(IOpenAIUtilsType)
    private openAIUtils: IOpenAIUtils,
  ) {
    this.temperature = 0.1;
    this.chatEncoder = encoding_for_model(this.chatModel);
  }

  public maxTokens(model: TiktokenModel): number {
    switch (model) {
      case "gpt-3.5-turbo":
        return 4096;
      case "gpt-4":
        return 8192;
    }
    return 0;
  }

  public executePrompt(prompt: Prompt): ResultAsync<LLMResponse, LLMError> {
    const messages = [
      { role: "system", content: "You are an helpful assistant." },
      { role: "user", content: prompt },
    ];

    return this.chatOnce(messages);
  }

  private getClient(): ResultAsync<OpenAI, LLMError> {
    return this.configProvider.getConfig().andThen((config) => {
      try {
        const clientOptions = {
          apiKey: config.scraper.OPENAI_API_KEY,
          timeout: config.scraper.timeout,
        };
        this.logUtils.debug("ChatGPTProvider", "constructor", clientOptions);
        return okAsync(new OpenAI(clientOptions));
      } catch (e) {
        return errAsync(new LLMError((e as Error).message, e));
      }
    });
    // const clientOptions = {
    //   apiKey: process.env.OPENAI_API_KEY,
    //   timeout: this.timeout,
    // };

    // this.logUtils.debug("ChatGPTProvider", "constructor", clientOptions);
    // this.openai = new OpenAI(clientOptions);
  }

  private chatOnce(messages): ResultAsync<LLMResponse, LLMError> {
    return this.getClient().andThen((openai) => {
      const params: CompletionCreateParamsNonStreaming = {
        model: this.chatModel,
        messages: messages,
        temperature: this.temperature,
      };
      const completionResult =
        this.openAIUtils.createChatCompletionNonStreaming(openai, params);

      return this.openAIUtils.parseCompletionResult(completionResult);
    });
  }
}
