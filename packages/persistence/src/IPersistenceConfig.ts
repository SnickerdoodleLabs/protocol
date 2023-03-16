import { ModelAliases } from "@glazed/types";
import {
  ChainId,
  ChainInformation,
  URLString,
} from "@snickerdoodlelabs/objects";

export interface IPersistenceConfig {
  supportedChains: ChainId[];
  accountBalancePollingIntervalMS: number;
  accountNFTPollingIntervalMS: number;
  backupChunkSizeTarget: number;
  ceramicNodeURL: URLString;
  chainInformation: Map<ChainId, ChainInformation>;
  defaultInsightPlatformBaseUrl: URLString;
  defaultGoogleCloudBucket: string;
  restoreTimeoutMS: number;
  enableBackupEncryption: boolean;
  dataWalletBackupIntervalMS: number;
}
