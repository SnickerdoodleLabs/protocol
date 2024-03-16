import { ResultAsync, okAsync } from "neverthrow";

import { IScraperConfig, IScraperConfigProvider } from "@ai-scraper/interfaces";
import { scraperConfig } from "@ai-scraper-test/mocks/testValues.js";

export class MockScraperConfigProvider implements IScraperConfigProvider {
  public getConfig(): ResultAsync<IScraperConfig, never> {
    return okAsync(scraperConfig);
  }
}
