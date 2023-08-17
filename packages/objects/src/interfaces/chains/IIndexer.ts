import { ResultAsync } from "neverthrow";

import { IndexerSupportSummary } from "@objects/businessObjects/index.js";
import { EChain, EComponentStatus } from "@objects/enum/index.js";

export interface IIndexer {
  initialize(): ResultAsync<void, never>;
  name(): string;
  getHealthCheck(): ResultAsync<Map<EChain, EComponentStatus>, never>;
  healthStatus(): Map<EChain, EComponentStatus>;
  getSupportedChains(): Map<EChain, IndexerSupportSummary>;
}
