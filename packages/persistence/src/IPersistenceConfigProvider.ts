import { ResultAsync } from "neverthrow";

import { IPersistenceConfig } from "@persistence/IPersistenceConfig";

export interface IPersistenceConfigProvider {
  getConfig(): ResultAsync<IPersistenceConfig, never>;
}

export const IPersistenceConfigProviderType = Symbol.for(
  "IPersistenceConfigProvider",
);
