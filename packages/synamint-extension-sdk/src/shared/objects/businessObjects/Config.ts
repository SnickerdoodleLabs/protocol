import {
  ChainId,
  DiscordConfig,
  ProviderUrl,
  TwitterConfig,
  URLString,
} from "@snickerdoodlelabs/objects";

import {
  EManifestVersion,
  EPlatform,
} from "@synamint-extension-sdk/shared/enums/config";
export class ExtensionConfig {
  constructor(
    public onboardingUrl: string,
    public manifestVersion: EManifestVersion,
    public platform: EPlatform,
    public controlChainId: ChainId,
    public ipfsFetchBaseUrl: URLString,
    public defaultInsightPlatformBaseUrl: URLString,
    public apiKeys: {
      alchemyApiKeys?: {
        Arbitrum: string;
        Astar: string;
        Mumbai: string;
        Optimism: string;
        Polygon: string;
        Solana: string;
        SolanaTestnet: string;
        Base: string;
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
      spaceAndTimeCredentials?: {
        userId: string;
        privateKey: string;
      };
      expandApiKey?: string;
      covalentApiKey?: string;
      moralisApiKey?: string;
      nftScanApiKey?: string;
      poapApiKey?: string;
      oklinkApiKey?: string;
      ankrApiKey?: string;
      bluezApiKey?: string;
      raribleApiKey?: string;
      spaceAndTimeKey?: string;
      blockvisionKey?: string;
    },
    public dnsServerAddress?: URLString,
    public requestForDataPollingIntervalMS?: number,
    public domainFilter?: string,
    public defaultGoogleCloudBucket?: string,

    public dropboxAppKey?: string,
    public dropboxAppSecret?: string,

    public portfolioPollingIntervalMS?: number,
    public transactionPollingIntervalMS?: number,
    public backupPollingIntervalMS?: number,
    public enableBackupEncryption?: boolean,
    public discordOverrides?: Partial<DiscordConfig>,
    public twitterOverrides?: Partial<TwitterConfig>,
    public primaryInfuraKey?: string,
    public secondaryInfuraKey?: string,
    public devChainProviderURL?: ProviderUrl,
    public injectedKey?: string,
  ) {}
}
