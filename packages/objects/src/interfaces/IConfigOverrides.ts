import { ChainId, URLString } from "@objects/primitives";

export interface IConfigOverrides {
  controlChainId?: ChainId;
  supportedChains?: ChainId[];
  providerAddress?: URLString;
  ipfsNodeAddress?: URLString;
  defaultInsightPlatformBaseUrl?: URLString;
  accountIndexingPollingIntervalMS?: number;
  accountBalancePollingIntervalMS?: number;
  accountNFTPollingIntervalMS?: number;
  covalentApiKey?: string;
  moralisApiKey?: string;
  dnsServerAddress?: URLString;
}
