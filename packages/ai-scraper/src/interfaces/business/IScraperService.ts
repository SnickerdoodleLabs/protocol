import {
  URLString,
  HTMLString,
  ScraperError,
  ELanguageCode,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { DomainTask } from "@ai-scraper/interfaces/objects/index.js";

export interface IScraperService {
  /**
   * This method to extract information from a website
   * @param url
   * @param html
   * @param suggestedDomainTask
   */
  scrape(
    url: URLString,
    html: HTMLString,
    suggestedDomainTask: DomainTask,
  ): ResultAsync<void, ScraperError>;

  /**
   *
   * @param url url of a website to classify
   * @param language language. Just pass en for now
   */

  classifyURL(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<DomainTask, ScraperError>;

  poll(): ResultAsync<void, ScraperError>;
}

export const IScraperServiceType = Symbol.for("IScraperService");
