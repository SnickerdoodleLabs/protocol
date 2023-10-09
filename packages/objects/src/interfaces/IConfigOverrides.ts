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
    Arbitrum?: string | null;
    Astar?: string | null;
    Mumbai?: string | null;
    Optimism?: string | null;
    Polygon?: string | null;
    Solana?: string | null;
    SolanaTestnet?: string | null;
  };
  etherscanApiKeys?: {
    Ethereum?: string | null;
    Polygon?: string | null;
    Avalanche?: string | null;
    Binance?: string | null;
    Moonbeam?: string | null;
    Optimism?: string | null;
    Arbitrum?: string | null;
    Gnosis?: string | null;
    Fuji?: string | null;
  };
  covalentApiKey?: string | null;
  moralisApiKey?: string | null;
  nftScanApiKey?: string | null;
  poapApiKey?: string | null;
  oklinkApiKey?: string | null;
  ankrApiKey?: string | null;
  bluezApiKey?: string | null;
  spaceAndTimeKey?: string | null;
  blockvisionKey: string | null;

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
  heartbeatIntervalMS?: number | null;
  primaryInfuraKey?: string | null;
  primaryRPCProviderURL?: ProviderUrl | null;
  secondaryInfuraKey?: string | null;
  secondaryRPCProviderURL?: ProviderUrl | null;
  devChainProviderURL?: ProviderUrl;
  iframeURL?: URLString;
  debug?: boolean;

  walletConnect?: {
    projectId: string;
  };

  queryPerformanceMetricsLimit ? : number
}
