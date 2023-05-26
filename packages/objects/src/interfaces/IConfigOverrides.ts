import { DiscordConfig, TwitterConfig } from "@objects/businessObjects";
import { ChainId, ProviderUrl, URLString } from "@objects/primitives";

export interface IConfigOverrides {
  controlChainId?: ChainId;
  supportedChains?: ChainId[];
  ipfsFetchBaseUrl?: URLString;
  defaultInsightPlatformBaseUrl?: URLString;
  accountIndexingPollingIntervalMS?: number;
  accountBalancePollingIntervalMS?: number;
  accountNFTPollingIntervalMS?: number;
  alchemyApiKeys?: {
    Arbitrum: string;
    Astar: string;
    Mumbai: string;
    Optimism: string;
    Polygon: string;
    Solana: string;
    SolanaTestnet: string;
  };
  covalentApiKey?: string;
  moralisApiKey?: string;
  nftScanApiKey?: string;
  poapApiKey?: string;
  oklinkApiKey?: string;
  ankrApiKey?: string;
  dnsServerAddress?: URLString;
  dataWalletBackupIntervalMS?: number;
  backupChunkSizeTarget?: number;
  ceramicNodeURL?: URLString;
  requestForDataCheckingFrequency?: number;
  domainFilter?: string;
  defaultGoogleCloudBucket?: string;
  enableBackupEncryption?: boolean;
  discordOverrides?: Partial<DiscordConfig>;
  twitterOverrides?: Partial<TwitterConfig>;
  heartbeatIntervalMS?: number;
  primaryInfuraKey: string;
  secondaryInfuraKey: string;
  devChainProviderURL?: ProviderUrl;
}
