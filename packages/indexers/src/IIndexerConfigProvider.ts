import { IConfigOverrides } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IIndexerConfig } from "@indexers/IIndexerConfig";

export interface IIndexerConfigProvider {
  getConfig(): ResultAsync<IIndexerConfig, never>;
}

export const IIndexerConfigProviderType = Symbol.for("IIndexerConfigProvider");
