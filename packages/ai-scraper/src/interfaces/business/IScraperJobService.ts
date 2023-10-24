import {
  URLString,
  HTMLString,
  ScraperError,
  ScraperJob,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IScraperJobService {
  add(job: ScraperJob): ResultAsync<void, ScraperError>;
  poll(): ResultAsync<void, ScraperError>;
}

export const IScraperJobServiceType = Symbol.for("IScraperJobService");
