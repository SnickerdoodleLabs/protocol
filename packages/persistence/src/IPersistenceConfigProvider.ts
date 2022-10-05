import { ResultAsync } from "neverthrow";

import { IPersistenceConfig } from "@persistence/IPersistenceConfig.js";

export interface IPersistenceConfigProvider {
  getConfig(): ResultAsync<IPersistenceConfig, never>;
}

export const IPersistenceConfigProviderType = Symbol.for(
  "IPersistenceConfigProvider",
);
