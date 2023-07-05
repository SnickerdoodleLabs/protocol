import { ResultAsync } from "neverthrow";

import { IndexerSupportSummary } from "@objects/businessObjects/index.js";
import { EChain, EComponentStatus } from "@objects/enum/index.js";
import { AjaxError } from "@objects/errors/index.js";

export interface IIndexer {
  name(): string;
  getHealthCheck(): ResultAsync<Map<EChain, EComponentStatus>, AjaxError>;
  healthStatus(): Map<EChain, EComponentStatus>;
  getSupportedChains(): Map<EChain, IndexerSupportSummary>;
}
