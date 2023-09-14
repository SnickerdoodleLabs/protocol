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
  ELanguageCode,
  DomainTask,
  ETask,
  LLMData,
  LLMResponse,
  Prompt,
} from "@snickerdoodlelabs/objects";
import {
  IPurchaseRepository,
  IPurchaseRepositoryType,
  PurchasedProduct,
} from "@snickerdoodlelabs/shopping-data";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IHTMLPreProcessor,
  IHTMLPreProcessorType,
  ILLMProvider,
  ILLMProviderType,
  ILLMPurchaseHistoryUtils,
  ILLMPurchaseHistoryUtilsType,
  IPromptDirector,
  IPromptDirectorType,
  IScraperService,
  IWebpageClassifier,
  IWebpageClassifierType,
} from "@ai-scraper/interfaces/index.js";

@injectable()
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
    @inject(IPurchaseRepositoryType)
    private purchaseRepository: IPurchaseRepository,
    @inject(IWebpageClassifierType)
    private webpageClassifier: IWebpageClassifier,
  ) {}

  public poll(): ResultAsync<void, ScraperError> {
    throw new Error("Method not implemented.");
  }

  public classifyURL(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<DomainTask, ScraperError> {
    return this.webpageClassifier.classify(url, language).mapErr((err) => {
      return new ScraperError(err.message, err);
    });
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

    return this.htmlPreProcessor.getLanguage(html).andThen((language) => {
      return this.buildPrompt(url, html, suggestedDomainTask)
        .andThen((prompt) => {
          return this.llmProvider
            .executePrompt(prompt)
            .andThen((llmResponse) => {
              return this.processLLMResponse(
                suggestedDomainTask,
                language,
                llmResponse,
              );
            });
        })
        .mapErr((err) => {
          return new ScraperError(err.message, err);
        });
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
    language: ELanguageCode,
    llmResponse: LLMResponse,
  ): ResultAsync<void, ScraperError | PersistenceError | LLMError> {
    if (domainTask.taskType == ETask.PurchaseHistory) {
      return this.purchaseHistoryLLMUtils
        .parsePurchases(domainTask.domain, language, llmResponse)
        .andThen((purchases) => {
          return this.savePurchases(purchases);
        });
    }
    return errAsync(new LLMError("Task type not supported."));
  }

  private savePurchases(
    purchases: PurchasedProduct[],
  ): ResultAsync<void, PersistenceError> {
    // return errAsync(new PersistenceError("savePurchases not implemented."));
    const results = purchases.map((purchase) => {
      return this.purchaseRepository.add(purchase);
    });

    return ResultUtils.combine(results).map(() => {});
  }
}
