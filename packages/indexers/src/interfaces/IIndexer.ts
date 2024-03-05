import {
  EChain,
  EComponentStatus,
  EDataProvider,
  IndexerSupportSummary,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IIndexer {
  initialize(): ResultAsync<void, never>;
  name(): EDataProvider;
  healthStatus(): Map<EChain, EComponentStatus>;
  getSupportedChains(): Map<EChain, IndexerSupportSummary>;
}
