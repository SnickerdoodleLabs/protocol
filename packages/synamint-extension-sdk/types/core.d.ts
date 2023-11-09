type ChainId =
  | 1
  | 5
  | 42
  | 137
  | 31337
  | 43114
  | 43113
  | 80001
  | -1
  | -2
  | 100
  | 56
  | 1284;

type SignatureAlgorithm = "hmac";
type HashAlgorithm = "sha1" | "sha256" | "sha512";

interface OAuth1Config {
  apiKey: string; // aka consumer key
  apiSecretKey: string; // aka consumer secret
  signingAlgorithm: SignatureAlgorithm;
  hashingAlgorithm: HashAlgorithm;
  oAuthBaseUrl: string;
  oAuthCallbackUrl: string;
}

interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  oauthBaseUrl: string;
  oauthRedirectUrl: string;
  accessTokenUrl?: string;
  refreshTokenUrl?: string;
}

interface TwitterConfig extends OAuth1Config {
  dataAPIUrl: string;
  pollInterval: number;
}

interface DiscordConfig extends OAuth2Config {
  dataAPIUrl: string;
  iconBaseUrl: string;
  pollInterval: number;
}

declare interface IExtensionConfigOverrides {
  onboardingUrl?: string;
  controlChainId?: ChainId;
  ipfsFetchBaseUrl?: string;
  defaultInsightPlatformBaseUrl?: string;
  domainFilter?: string;
  ceramicNodeUrl?: string;
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
  dnsServerAddress?: string;
  requestForDataPollingIntervalMS?: number;
  defaultGoogleCloudBucket?: string;
  enableBackupEncryption?: boolean;
  discordOverrides?: Partial<DiscordConfig>;
  twitterOverrides?: Partial<TwitterConfig>;
  devChainProviderURL?: string;
  providerKey?: string;
}

export declare const initializeSDKCore: (
  configOverrides: IExtensionConfigOverrides,
) => PromiseLike<void>;
