import {
  ChainId,
  URLString,
  DiscordConfig,
  TwitterConfig,
  ProviderUrl,
} from "@snickerdoodlelabs/objects";

export interface IExtensionConfigDefaults {
  onboardingUrl: string;
  accountCookieUrl: string;
  cookieLifeTime: number;
  controlChainId: ChainId;
  supportedChains: ChainId[];
  ipfsFetchBaseUrl: URLString;
  defaultInsightPlatformBaseUrl: URLString;
  domainFilter: string;
  portfolioPollingIntervalMS: number;
  transactionPollingIntervalMS: number;
  backupPollingIntervalMS: number;
  requestForDataCheckingFrequency: number;
}

export interface IExtensionConfig extends IExtensionConfigDefaults {
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
  defaultGoogleCloudBucket?: string;
  dropboxAppKey?: string;
  dropboxAppSecret?: string;
  enableBackupEncryption?: boolean;
  discordOverrides?: Partial<DiscordConfig>;
  twitterOverrides?: Partial<TwitterConfig>;
  primaryInfuraKey?: string;
  secondaryInfuraKey?: string;
  devChainProviderURL?: ProviderUrl;
}

export interface IExtensionConfigOverrides {
  onboardingUrl?: URLString;
  accountCookieUrl?: URLString;
  controlChainId?: ChainId;
  supportedChains?: ChainId[];
  cookieLifeTime?: number;
  ipfsFetchBaseUrl?: URLString;
  defaultInsightPlatformBaseUrl?: URLString;
  domainFilter?: string;
  portfolioPollingIntervalMS?: number;
  transactionPollingIntervalMS?: number;
  backupPollingIntervalMS?: number;
  apiKeys: {
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
    primaryInfuraKey?: string;
    secondaryInfuraKey?: string;
  };

  dnsServerAddress?: URLString;
  requestForDataCheckingFrequency?: number;
  defaultGoogleCloudBucket?: string;
  dropboxAppKey?: string;
  dropboxAppSecret?: string;
  redirectUri?: string;
  enableBackupEncryption?: boolean;
  discordOverrides?: Partial<DiscordConfig>;
  twitterOverrides?: Partial<TwitterConfig>;
  devChainProviderURL?: ProviderUrl;
}
