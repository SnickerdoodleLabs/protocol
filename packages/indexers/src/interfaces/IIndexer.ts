import {
  EChain,
  EComponentStatus,
  IndexerSupportSummary,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IIndexer {
  initialize(): ResultAsync<void, never>;
  name(): string;
  getHealthCheck(): ResultAsync<Map<EChain, EComponentStatus>, never>;
  healthStatus(): Map<EChain, EComponentStatus>;
  getSupportedChains(): Map<EChain, IndexerSupportSummary>;
}
