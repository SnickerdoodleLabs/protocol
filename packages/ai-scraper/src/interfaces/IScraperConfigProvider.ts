import { ResultAsync } from "neverthrow";

import { IScraperConfig } from "@ai-scraper/interfaces/IScraperConfig.js";

export interface IScraperConfigProvider {
  getConfig(): ResultAsync<IScraperConfig, never>;
}
export const IScraperConfigProviderType = Symbol.for("IScraperConfigProvider");
