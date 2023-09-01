import {
  DiscordConfig,
  TwitterConfig,
} from "@objects/businessObjects/index.js";
import { EChain } from "@objects/enum/index.js";
import { ProviderUrl, URLString } from "@objects/primitives/index.js";

export interface IConfigOverrides {
  controlChainId?: EChain;
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

  dropboxAppKey?: string;
  dropboxAppSecret?: string;
  dropboxRedirectUri?: string;

  enableBackupEncryption?: boolean;
  discordOverrides?: Partial<DiscordConfig>;
  twitterOverrides?: Partial<TwitterConfig>;
  heartbeatIntervalMS?: number;
  primaryInfuraKey?: string;
  primaryRPCProviderURL?: ProviderUrl;
  secondaryInfuraKey?: string;
  secondaryRPCProviderURL?: ProviderUrl;
  devChainProviderURL?: ProviderUrl;
  iframeURL?: URLString;
  debug?: boolean;

  walletConnect?: {
    projectId: string;
  };
}
