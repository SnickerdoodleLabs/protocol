import { ChainId, ProviderUrl, URLString } from "@snickerdoodlelabs/objects";

import { EManifestVersion, EPlatform } from "@shared/enums/config";

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
    public dnsServerAddress?: URLString,
    public requestForDataCheckingFrequency?: number,
    public domainFilter?: string,
    public backupChunkSizeTarget?: number,
  ) {}
}
