import { MapModelTypes } from "@glazed/types";

import { ModelTypes } from "@objects/interfaces";
import { ChainId, ProviderUrl, URLString } from "@objects/primitives";

export interface IConfigOverrides {
  controlChainId?: ChainId;
  supportedChains?: ChainId[];
  ipfsFetchBaseUrl?: URLString;
  defaultInsightPlatformBaseUrl?: URLString;
  accountIndexingPollingIntervalMS?: number;
  accountBalancePollingIntervalMS?: number;
  accountNFTPollingIntervalMS?: number;
  covalentApiKey?: string;
  moralisApiKey?: string;
  nftScanApiKey?: string;
  poapApiKey?: string;
  dnsServerAddress?: URLString;
  dataWalletBackupIntervalMS?: number;
  backupChunkSizeTarget?: number;
  ceramicModelAliases?: MapModelTypes<ModelTypes, string>;
  ceramicNodeURL?: URLString;
  controlChainProviderURL?: ProviderUrl; // Only used with the Dev Doodle Chain
  requestForDataCheckingFrequency?: number;
  domainFilter?: string;
  defaultGoogleCloudBucket?: string;
  enableBackupEncryption?: boolean;
}
