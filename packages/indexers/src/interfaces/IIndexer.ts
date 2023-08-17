import {
  EChain,
  EComponentStatus,
  IndexerSupportSummary,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IIndexer {
  initialize(): ResultAsync<void, never>;
  name(): string;
  healthStatus(): Map<EChain, EComponentStatus>;
  getSupportedChains(): Map<EChain, IndexerSupportSummary>;
}
