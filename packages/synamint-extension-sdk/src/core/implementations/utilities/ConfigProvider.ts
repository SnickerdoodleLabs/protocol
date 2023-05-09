import { ChainId, URLString } from "@snickerdoodlelabs/objects";
import { IConfigProvider } from "@synamint-extension-sdk/core/interfaces/utilities";
import {
  IExtensionConfig,
  IExtensionConfigDefaults,
  IExtensionConfigOverrides,
} from "@synamint-extension-sdk/shared/interfaces/IExtensionConfig";

const ONE_MINUTE_MS = 60000;

const defaultConfigs: IExtensionConfig = {
  onboardingUrl: "https://datawallet.snickerdoodle.com/",
  accountCookieUrl: "https://snickerdoodlelabs.io/",
  cookieLifeTime: 2,
  controlChainId: ChainId(43113),
  supportedChains: [
    ChainId(8001),
    ChainId(43113),
    ChainId(1),
    ChainId(137),
    ChainId(43114),
    ChainId(-1),
  ],
  ipfsFetchBaseUrl: URLString("https://ipfs-gateway.snickerdoodle.com/ipfs/"),
  defaultInsightPlatformBaseUrl: URLString(
    "https://insight-api.snickerdoodle.com/v0/",
  ),
  domainFilter: "(localhost|chrome://)",
  ceramicNodeUrl: URLString(""),
  portfolioPollingIntervalMS: ONE_MINUTE_MS,
  transactionPollingIntervalMS: ONE_MINUTE_MS,
  backupPollingIntervalMS: ONE_MINUTE_MS,
  requestForDataCheckingFrequency: 4000,
};

export class ConfigProvider implements IConfigProvider {
  private config: IExtensionConfig = defaultConfigs;

  constructor() {}
  public setConfigOverrides(configOverrides: IExtensionConfigOverrides): void {}
  public getConfig(): IExtensionConfig {
    return this.config;
  }
}
