import { ModelAliases } from "@glazed/types";
import {
  ChainId,
  ChainInformation,
  ModelTypes,
  URLString,
} from "@snickerdoodlelabs/objects";

export interface IPersistenceConfig {
  supportedChains: ChainId[];
  accountBalancePollingIntervalMS: number;
  accountNFTPollingIntervalMS: number;
  chainInformation: Map<ChainId, ChainInformation>;
  backupChunkSizeTarget: number;
  ceramicModelAliases: ModelAliases<ModelTypes>;
  ceramicNodeURL: URLString;
}
