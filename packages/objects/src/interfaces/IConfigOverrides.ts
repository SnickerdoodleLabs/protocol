import {
  DiscordConfig,
  TwitterConfig,
} from "@objects/businessObjects/index.js";
import { ChainId, ProviderUrl, URLString } from "@objects/primitives/index.js";

export interface IConfigOverrides {
  controlChainId?: ChainId;
  supportedChains?: ChainId[];
  ipfsFetchBaseUrl?: URLString;
  defaultInsightPlatformBaseUrl?: URLString;
  accountIndexingPollingIntervalMS?: number;
  accountBalancePollingIntervalMS?: number;
  accountNFTPollingIntervalMS?: number;
  cloudStorageKey?: string;
  dropboxAppKey?: string;
  dropboxAppSecret?: string;
  alchemyApiKeys?: {
    Arbitrum: string;
    Astar: string;
    Mumbai: string;
    Optimism: string;
    Polygon: string;
    Solana: string;
    SolanaTestnet: string;
  };
  etherscanApiKeys?: {
    Ethereum: string;
    Polygon: string;
    Avalanche: string;
    Binance: string;
    Moonbeam: string;
    Optimism: string;
    Arbitrum: string;
    Gnosis: string;
    Fuji: string;
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
  requestForDataCheckingFrequency?: number;
  domainFilter?: string;
  defaultGoogleCloudBucket?: string;

  defaultDropboxCloudBucket?: string;
  enableBackupEncryption?: boolean;
  discordOverrides?: Partial<DiscordConfig>;
  twitterOverrides?: Partial<TwitterConfig>;
  heartbeatIntervalMS?: number;
  primaryInfuraKey: string;
  secondaryInfuraKey?: string;
  devChainProviderURL?: ProviderUrl;
}
