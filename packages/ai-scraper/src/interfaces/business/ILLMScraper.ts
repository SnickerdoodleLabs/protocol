import { ScraperJob } from "@snickerdoodlelabs/objects";

export interface ILLMScraper {
  scrape(jobs: ScraperJob[]);
}

export const ILLMScraperType = Symbol.for("ILLMScraper");
