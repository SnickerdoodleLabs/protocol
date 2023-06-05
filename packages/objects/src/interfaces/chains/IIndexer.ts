import { ResultAsync } from "neverthrow";

import { IndexerSupportSummary } from "@objects/businessObjects/IndexerSupportSummary";
import { EChain, EComponentStatus } from "@objects/enum";
import { AjaxError } from "@objects/errors";

export interface IIndexer {
  name(): string;
  getHealthCheck(): ResultAsync<Map<EChain, EComponentStatus>, AjaxError>;
  healthStatus(): Map<EChain, EComponentStatus>;
  getSupportedChains(): Map<EChain, IndexerSupportSummary>;
}
