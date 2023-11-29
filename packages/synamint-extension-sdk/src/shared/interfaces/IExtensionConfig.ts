import {
  ChainId,
  URLString,
  DiscordConfig,
  TwitterConfig,
  ProviderUrl,
} from "@snickerdoodlelabs/objects";

export interface IExtensionConfigDefaults {
  onboardingUrl: string;
  controlChainId: ChainId;
  ipfsFetchBaseUrl: URLString;
  defaultInsightPlatformBaseUrl: URLString;
  domainFilter: string;
  portfolioPollingIntervalMS: number;
  transactionPollingIntervalMS: number;
  backupPollingIntervalMS: number;
  requestForDataPollingIntervalMS: number;
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
  bluezApiKey?: string;
  spaceAndTimeKey?: string;
  blockvisionKey?: string;
  dnsServerAddress?: URLString;
  defaultGoogleCloudBucket?: string;
  dropboxAppKey?: string;
  dropboxAppSecret?: string;
  dropboxRedirectUri?: string;
  enableBackupEncryption?: boolean;
  discordOverrides?: Partial<DiscordConfig>;
  twitterOverrides?: Partial<TwitterConfig>;
  primaryInfuraKey?: string;
  secondaryInfuraKey?: string;
  devChainProviderURL?: ProviderUrl;
  providerKey?: string;
}

export interface IExtensionConfigOverrides {
  onboardingUrl?: URLString;
  controlChainId?: ChainId;
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
    bluezApiKey?: string;
    spaceAndTimeKey?: string;
    blockvisionKey?: string;
    primaryInfuraKey?: string;
    secondaryInfuraKey?: string;
  };

  dnsServerAddress?: URLString;
  requestForDataPollingIntervalMS?: number;
  defaultGoogleCloudBucket?: string;
  dropboxAppKey?: string;
  dropboxAppSecret?: string;
  dropboxRedirectUri?: string;
  enableBackupEncryption?: boolean;
  discordOverrides?: Partial<DiscordConfig>;
  twitterOverrides?: Partial<TwitterConfig>;
  devChainProviderURL?: ProviderUrl;
  providerKey?: string;
}
