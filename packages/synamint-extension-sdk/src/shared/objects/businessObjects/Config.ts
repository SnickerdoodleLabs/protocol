import {
  ChainId,
  DiscordConfig,
  ProviderUrl,
  TwitterConfig,
  URLString,
  EChain,
} from "@snickerdoodlelabs/objects";

import {
  EManifestVersion,
  EPlatform,
} from "@synamint-extension-sdk/shared/enums/config";
export class ExtensionConfig {
  constructor(
    public onboardingUrl: string,
    public accountCookieUrl: string,
    public cookieLifeTime: number,
    public manifestVersion: EManifestVersion,
    public platform: EPlatform,
    public controlChainId: ChainId,
    public supportedChains: ChainId[],
    public ipfsFetchBaseUrl: URLString,
    public defaultInsightPlatformBaseUrl: URLString,
    public ceramicNodeUrl: URLString,
    public apiKeys: {
      alchemyApiKeys?: Map<EChain, string | null>;
      etherscanApiKeys?: Map<EChain, string | null>;
      covalentApiKey?: string;
      moralisApiKey?: string;
      nftScanApiKey?: string;
      poapApiKey?: string;
      oklinkApiKey?: string;
      ankrApiKey?: string;
    },
    public dnsServerAddress?: URLString,
    public requestForDataCheckingFrequency?: number,
    public domainFilter?: string,
    public defaultGoogleCloudBucket?: string,
    public portfolioPollingIntervalMS?: number,
    public transactionPollingIntervalMS?: number,
    public backupPollingIntervalMS?: number,
    public enableBackupEncryption?: boolean,
    public discordOverrides?: Partial<DiscordConfig>,
    public twitterOverrides?: Partial<TwitterConfig>,
    public primaryInfuraKey?: string,
    public secondaryInfuraKey?: string,
    public devChainProviderURL?: ProviderUrl,
  ) {}
}
