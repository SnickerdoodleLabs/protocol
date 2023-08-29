/***
 * The main class that connects everything together
 */

import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  URLString,
  HTMLString,
  ScraperError,
  LLMError,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { PurchasedProduct } from "@snickerdoodlelabs/shopping-data";
import { inject } from "inversify";
import { ResultAsync, errAsync } from "neverthrow";

import {
  DomainTask,
  ETask,
  IHTMLPreProcessor,
  IHTMLPreProcessorType,
  ILLMProvider,
  ILLMProviderType,
  ILLMPurchaseHistoryUtils,
  ILLMPurchaseHistoryUtilsType,
  IPromptDirector,
  IPromptDirectorType,
  IScraperService,
  LLMData,
  LLMResponse,
  Prompt,
} from "@ai-scraper/interfaces/index.js";

export class LLMScraperService implements IScraperService {
  public constructor(
    @inject(ILogUtilsType)
    private logUtils: ILogUtils,
    @inject(IHTMLPreProcessorType)
    private htmlPreProcessor: IHTMLPreProcessor,
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
   * Now we will scrape it immmediately and assume the task is . In future it's done by a job executor with a rate limiter
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

    return this.buildPrompt(url, html, suggestedDomainTask)
      .andThen((prompt) => {
        return this.llmProvider.executePrompt(prompt).andThen((llmResponse) => {
          return this.processLLMResponse(suggestedDomainTask, llmResponse);
        });
      })
      .mapErr((err) => {
        return new ScraperError(err.message, err);
      });
  }

  private buildPrompt(
    url: URLString,
    html: HTMLString,
    domainTask: DomainTask,
  ): ResultAsync<Prompt, ScraperError | LLMError> {
    if (domainTask.taskType == ETask.PurchaseHistory) {
      return this.htmlPreProcessor.htmlToText(html, null).andThen((text) => {
        return this.promptDirector.makePurchaseHistoryPrompt(LLMData(text));
      });
    }
    return errAsync(new LLMError("Task type not supported."));
  }

  private processLLMResponse(
    domainTask: DomainTask,
    llmResponse: LLMResponse,
  ): ResultAsync<void, ScraperError | PersistenceError | LLMError> {
    if (domainTask.taskType == ETask.PurchaseHistory) {
      return this.purchaseHistoryLLMUtils
        .parsePurchases(domainTask.domain, llmResponse)
        .andThen((purchases) => {
          return this.savePurchases(purchases);
        });
    }
    return errAsync(new LLMError("Task type not supported."));
  }

  private savePurchases(
    purchases: PurchasedProduct[],
  ): ResultAsync<void, PersistenceError> {
    return errAsync(new PersistenceError("savePurchases not implemented."));
  }
}
