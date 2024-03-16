import { ILogUtilsType, ILogUtils } from "@snickerdoodlelabs/common-utils";
import { LLMError, LLMResponse, Prompt } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import {
  getEncoding,
  encodingForModel,
  TiktokenModel,
  Tiktoken,
} from "js-tiktoken";
import { ResultAsync, okAsync, errAsync } from "neverthrow";
import OpenAI from "openai";
import {
  ChatCompletion,
  ChatCompletionCreateParamsNonStreaming,
  CompletionCreateParamsNonStreaming,
} from "openai/resources/chat";

import {
  ILLMRepository,
  IOpenAIUtils,
  IOpenAIUtilsType,
  IScraperConfigProvider,
  IScraperConfigProviderType,
} from "@ai-scraper/interfaces/index.js";

@injectable()
export class ChatGPTRepository implements ILLMRepository {
  private chatModel: TiktokenModel = "gpt-3.5-turbo"; // back to 4k
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
    this.chatEncoder = encodingForModel(this.chatModel);
  }

  public defaultMaxTokens(): number {
    return 4096;
  }

  public maxTokens(model: TiktokenModel): number {
    switch (model) {
      case "gpt-3.5-turbo":
        return 4096;
      case "gpt-3.5-turbo-16k":
        return 4096 * 4;
      case "gpt-4":
        return 8192;
    }
    return 0;
  }

  public getPromptTokens(prompt: Prompt): ResultAsync<number, Error> {
    const tokens = this.chatEncoder.encode(prompt); // This might take a while
    return okAsync(tokens.length);
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
        // this.logUtils.debug("ChatGPTProvider", "constructor", clientOptions);
        return okAsync(new OpenAI(clientOptions));
      } catch (e) {
        return errAsync(new LLMError((e as Error).message, e));
      }
    });
  }

  private chatOnce(messages): ResultAsync<LLMResponse, LLMError> {
    return this.getClient().andThen((openai) => {
      const params: ChatCompletionCreateParamsNonStreaming = {
        model: this.chatModel,
        messages: messages,
        temperature: this.temperature,
      };

      return this.openAIUtils.getLLMResponseNonStreaming(openai, params);
    });
  }
}
