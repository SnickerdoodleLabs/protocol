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
  ceramicNodeUrl: URLString;
  covalentApiKey?: string;
  moralisApiKey?: string;
  nftScanApiKey?: string;
  poapApiKey?: string;
  oklinkApiKey?: string;
  ankrApiKey?: string;
  dnsServerAddress?: URLString;
  defaultGoogleCloudBucket?: string;
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
  ceramicNodeUrl?: URLString;
  portfolioPollingIntervalMS?: number;
  transactionPollingIntervalMS?: number;
  backupPollingIntervalMS?: number;
  apiKeys: {
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
  enableBackupEncryption?: boolean;
  discordOverrides?: Partial<DiscordConfig>;
  twitterOverrides?: Partial<TwitterConfig>;
  devChainProviderURL?: ProviderUrl;
}
