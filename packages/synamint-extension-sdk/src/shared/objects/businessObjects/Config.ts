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
    public accountCookieUrl: string,
    public cookieLifeTime: number,
    public manifestVersion: EManifestVersion,
    public platform: EPlatform,
    public controlChainId: ChainId,
    public supportedChains: ChainId[],
    public ipfsFetchBaseUrl: URLString,
    public defaultInsightPlatformBaseUrl: URLString,
    public ceramicNodeUrl: URLString,
    public controlChainProviderUrl?: ProviderUrl,
    public covalentApiKey?: string,
    public moralisApiKey?: string,
    public nftScanApiKey?: string,
    public poapApiKey?: string,
    public oklinkApiKey?: string,
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
  ) {}
}
