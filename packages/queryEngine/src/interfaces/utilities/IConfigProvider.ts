import { QueryEngineConfig } from "@query-engine/interfaces/objects";
import { ResultAsync } from "neverthrow";

export interface IConfigProvider {
    getConfig(): ResultAsync<QueryEngineConfig, never>;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
