import { ResultAsync } from "neverthrow";

import { IIndexerConfig } from "@indexers/IIndexerConfig.js";

export interface IIndexerConfigProvider {
  getConfig(): ResultAsync<IIndexerConfig, never>;
}

export const IIndexerConfigProviderType = Symbol.for("IIndexerConfigProvider");
