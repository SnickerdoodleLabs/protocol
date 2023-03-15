import { ModelAliases } from "@glazed/types";
import {
  ChainId,
  ChainInformation,
  EFieldKey,
  ModelTypes,
  URLString,
} from "@snickerdoodlelabs/objects";

export interface IPersistenceConfig {
  supportedChains: ChainId[];
  accountBalancePollingIntervalMS: number;
  accountNFTPollingIntervalMS: number;
  backupChunkSizeTarget: number;
  ceramicModelAliases: ModelAliases<ModelTypes>;
  ceramicNodeURL: URLString;
  chainInformation: Map<ChainId, ChainInformation>;
  defaultInsightPlatformBaseUrl: URLString;
  defaultGoogleCloudBucket: string;
  restoreTimeoutMS: number;
  enableBackupEncryption: boolean;
  dataWalletBackupIntervalMS: number;
}
