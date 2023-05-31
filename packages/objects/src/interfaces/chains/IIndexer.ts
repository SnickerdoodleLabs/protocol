import { ResultAsync } from "neverthrow";

import {
  EComponentStatus,
  IndexerSupportSummary,
} from "@objects/businessObjects";
import { EChain } from "@objects/enum";
import { AjaxError } from "@objects/errors";

export interface IIndexer {
  getHealthCheck(): ResultAsync<Map<EChain, EComponentStatus>, AjaxError>;
  healthStatus(): Map<EChain, EComponentStatus>;
  getSupportedChains(): Map<EChain, IndexerSupportSummary>;
}
