import {
  URLString,
  HTMLString,
  ScraperError,
  ELanguageCode,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { DomainTask } from "@ai-scraper/interfaces/objects/index.js";

export interface IScraperService {
  scrape(
    url: URLString,
    html: HTMLString,
    suggestedDomainTask: DomainTask,
  ): ResultAsync<void, ScraperError>;

  classifyURL(
    url: URLString,
    language: ELanguageCode,
  ): ResultAsync<DomainTask, ScraperError>;

  poll(): ResultAsync<void, ScraperError>;
}

export const IScraperServiceType = Symbol.for("IScraperService");
