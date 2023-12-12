import {
  URLString,
  HTMLString,
  ScraperError,
  ELanguageCode,
  DomainTask,
  PersistenceError,
  LLMError,
  InvalidURLError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

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
  ): ResultAsync<void, ScraperError | LLMError | PersistenceError>;

  /**
   *
   * @param url url of a website to classify
   * @param language language. Just pass en for now
   */

  classifyURL(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<DomainTask, InvalidURLError>;

  poll(): ResultAsync<void, ScraperError>;
}

export const IScraperServiceType = Symbol.for("IScraperService");
