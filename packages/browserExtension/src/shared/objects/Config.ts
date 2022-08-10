import { CoreConfig } from "@snickerdoodlelabs/core/src/interfaces/objects";
import { ChainId, URLString } from "@snickerdoodlelabs/objects";

import { EManifestVersion, EPlatform } from "@shared/enums/config";

export class ExtensionConfig {
  constructor(
    public onboardingUrl: string,
    public accountCookieUrl: string,
    public manifestVersion: EManifestVersion,
    public platform: EPlatform,
    public controlChainId: ChainId,
    public supportedChains: ChainId[],
    public ipfsFetchBaseUrl: URLString,
    public defaultInsightPlatformBaseUrl: URLString,
    public covalentApiKey?: string,
    public moralisApiKey?: string,
    public dnsServerAddress?: URLString,
  ) {}
}
