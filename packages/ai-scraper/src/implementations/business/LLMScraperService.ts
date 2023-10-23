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
  IPurchaseUtils,
  IPurchaseUtilsType,
  ProductCategories,
  PurchasedProduct,
  UnknownProductCategory,
} from "@snickerdoodlelabs/shopping-data";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IHTMLPreProcessor,
  IHTMLPreProcessorType,
  ILLMProductMetaUtils,
  ILLMProductMetaUtilsType,
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
    @inject(IWebpageClassifierType)
    private webpageClassifier: IWebpageClassifier,
    @inject(IPurchaseUtilsType)
    private purchaseUtils: IPurchaseUtils,
    @inject(ILLMPurchaseHistoryUtilsType)
    private purchaseHistoryLLMUtils: ILLMPurchaseHistoryUtils,
    @inject(IPurchaseRepositoryType)
    private purchaseRepository: IPurchaseRepository,
    @inject(ILLMProductMetaUtilsType)
    private productMetaUtils: ILLMProductMetaUtils,
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
    if (suggestedDomainTask.taskType == ETask.PurchaseHistory) {
      return this.scrapePurchaseHistory(url, html, suggestedDomainTask);
    }
    return errAsync(new ScraperError("Task type not supported."));
  }

  private scrapePurchaseHistory(
    url: URLString,
    html: HTMLString,
    suggestedDomainTask: DomainTask,
  ): ResultAsync<void, ScraperError> {
    /*
    This is a two step process.
    Step 1: get purchase information from LLM
    Step 2: for each purchase, if category is null/unknown, then add it to the next prompt to get meta information
    */
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
              return this.processLLMPurchaseResponse(
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

  private processLLMPurchaseResponse(
    domainTask: DomainTask,
    language: ELanguageCode,
    llmResponse: LLMResponse,
  ): ResultAsync<void, ScraperError | PersistenceError | LLMError> {
    if (domainTask.taskType == ETask.PurchaseHistory) {
      return this.purchaseHistoryLLMUtils
        .parsePurchases(domainTask.domain, language, llmResponse)
        .andThen((purchases) => {
          // Find a better way to refactor it
          // return this.savePurchases(purchases);
          return this.savePurchases(purchases).andThen(() => {
            return this.scrapeProductMeta(domainTask, language, purchases);
          });
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

  private scrapeProductMeta(
    domainTask: DomainTask,
    language: ELanguageCode,
    purchases: PurchasedProduct[],
  ): ResultAsync<void, ScraperError> {
    // convert purchases to LLM data first
    const nullCategoryPurchases =
      this.purchaseUtils.getNullCategoryPurchases(purchases);

    return this.scrapeCategory(domainTask, language, nullCategoryPurchases);
  }

  private scrapeCategory(
    domainTask: DomainTask,
    language: ELanguageCode,
    nullCategoryPurchases: PurchasedProduct[],
  ) {
    const purchaseJsonArr = nullCategoryPurchases.map((purchase, idx) => {
      return {
        product_id: idx,
        product_name: purchase.name,
      };
    });
    const llmData = LLMData(JSON.stringify(purchaseJsonArr));

    return this.promptDirector
      .makeProductMetaPrompt(llmData)
      .andThen((prompt) => {
        return this.llmProvider.executePrompt(prompt).andThen((llmResponse) => {
          const productMetas = this.productMetaUtils.parseMeta(
            domainTask.domain,
            language,
            llmResponse,
          );
          // TODO
          return productMetas.andThen((metas) => {
            const purchasesToUpdate = metas.map((meta) => {
              const purchase = nullCategoryPurchases[parseInt(meta.productId)]; // this indexing is not correct
              purchase.category = meta.category ?? UnknownProductCategory; // TODO convert to enum
              purchase.keywords = meta.keywords;
              return purchase;
            });

            return this.savePurchases(purchasesToUpdate);
          });
        });
      })
      .mapErr((err) => {
        return new ScraperError(err.message, err);
      });
  }
}
