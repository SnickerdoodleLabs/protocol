import { ResultAsync } from "neverthrow";

import { QueryEngineConfig } from "@query-engine/interfaces/objects";

export interface IConfigProvider {
  getConfig(): ResultAsync<QueryEngineConfig, never>;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
