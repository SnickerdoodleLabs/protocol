import { ScraperJob } from "@ai-scraper/interfaces/objects/index.js";

export interface ILLMScraper {
  scrape(jobs: ScraperJob[]);
}

export const ILLMScraperType = Symbol.for("ILLMScraper");
