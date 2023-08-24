/***
 * The main class that connects everything together
 */

import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  URLString,
  HTMLString,
  ScraperError,
  LLMError,
} from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { ResultAsync, errAsync } from "neverthrow";

import {
  DomainTask,
  ILLMProvider,
  ILLMProviderType,
  ILLMPurchaseHistoryUtils,
  ILLMPurchaseHistoryUtilsType,
  IPromptDirector,
  IPromptDirectorType,
  IScraperService,
  Prompt,
} from "@ai-scraper/interfaces/index.js";

export class LLMScraperService implements IScraperService {
  public constructor(
    @inject(ILogUtilsType)
    private logUtils: ILogUtils,
    @inject(ILLMProviderType)
    private llmProvider: ILLMProvider,
    @inject(IPromptDirectorType)
    private promptDirector: IPromptDirector,
    @inject(ILLMPurchaseHistoryUtilsType)
    private purchaseHistoryLLMUtils: ILLMPurchaseHistoryUtils,
  ) {}

  public poll(): ResultAsync<void, ScraperError> {
    throw new Error("Method not implemented.");
  }

  /**
   * Now we will scrape it immmediately. In future it's done by a job executor with a rate limiter
   */
  public scrape(
    url: URLString,
    html: HTMLString,
    suggestedDomainTask: DomainTask,
  ): ResultAsync<void, ScraperError> {
    // throw new Error("Method not implemented.");
    // 1. build prompt
    // 2. execute prompt
    // 3. parse response for information
    // 4. persist information

    const prompt = this.buildPrompt(url, html, suggestedDomainTask);

    return errAsync(new ScraperError("scrape not implemented."));
  }

  private buildPrompt(
    url: URLString,
    html: HTMLString,
    suggestedDomainTask: DomainTask,
  ): ResultAsync<Prompt, LLMError> {
    throw new Error("Method not implemented.");
  }
}
