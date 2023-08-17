import {
  URLString,
  HTMLString,
  ScraperError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { ScraperJob } from "@ai-scraper/interfaces/objects/index.js";

export interface IScraperJobService {
  add(job: ScraperJob): ResultAsync<void, ScraperError>;
  poll(): ResultAsync<void, ScraperError>;
}

export const IScraperJobServiceType = Symbol.for("IScraperJobService");
