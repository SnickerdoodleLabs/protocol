import { ModelAliases } from "@glazed/types";
import { ChainId, ModelTypes, URLString } from "@snickerdoodlelabs/objects";

export interface IPersistenceConfig {
  supportedChains: ChainId[];
  accountBalancePollingIntervalMS: number;
  accountNFTPollingIntervalMS: number;
  backupChunkSizeTarget: number;
  ceramicModelAliases: ModelAliases<ModelTypes>;
  ceramicNodeURL: URLString;
  defaultInsightPlatformBaseUrl: URLString;
  defaultGoogleCloudBucket: string;
}
