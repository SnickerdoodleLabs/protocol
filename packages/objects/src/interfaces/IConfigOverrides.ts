import { MapModelTypes } from "@glazed/types";

import { ModelTypes } from "@objects/interfaces";
import { ChainId, URLString } from "@objects/primitives";

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
  dnsServerAddress?: URLString;
  dataWalletBackupIntervalMS?: number;
  backupChunkSizeTarget?: number;
  ceramicModelAliases?: MapModelTypes<ModelTypes, string>;
  ceramicNodeURL?: URLString;
}
