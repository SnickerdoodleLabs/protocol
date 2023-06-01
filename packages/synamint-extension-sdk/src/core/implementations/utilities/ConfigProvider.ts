import { ChainId, URLString } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";

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
    ChainId(80001),
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
@injectable()
export class ConfigProvider implements IConfigProvider {
  private config: IExtensionConfig = defaultConfigs;

  constructor() {}
  public setConfigOverrides(configOverrides: IExtensionConfigOverrides): void {
    this.config.onboardingUrl =
      configOverrides.onboardingUrl ?? this.config.onboardingUrl;
    this.config.accountCookieUrl =
      configOverrides.accountCookieUrl ?? this.config.accountCookieUrl;
    this.config.cookieLifeTime =
      configOverrides.cookieLifeTime ?? this.config.cookieLifeTime;
    this.config.controlChainId =
      configOverrides.controlChainId ?? this.config.controlChainId;

    this.config.devChainProviderURL =
      configOverrides.devChainProviderURL ?? this.config.devChainProviderURL;
    this.config.supportedChains =
      configOverrides.supportedChains ?? this.config.supportedChains;
    this.config.ipfsFetchBaseUrl =
      configOverrides.ipfsFetchBaseUrl ?? this.config.ipfsFetchBaseUrl;
    this.config.defaultInsightPlatformBaseUrl =
      configOverrides.defaultInsightPlatformBaseUrl ??
      this.config.defaultInsightPlatformBaseUrl;
    this.config.domainFilter =
      configOverrides.domainFilter ?? this.config.domainFilter;
    this.config.ceramicNodeUrl =
      configOverrides.ceramicNodeUrl ?? this.config.ceramicNodeUrl;
    this.config.portfolioPollingIntervalMS =
      configOverrides.portfolioPollingIntervalMS ??
      this.config.portfolioPollingIntervalMS;
    this.config.transactionPollingIntervalMS =
      configOverrides.transactionPollingIntervalMS ??
      this.config.transactionPollingIntervalMS;
    this.config.backupPollingIntervalMS =
      configOverrides.backupPollingIntervalMS ??
      this.config.backupPollingIntervalMS;
    // api keys
    this.config.alchemyApiKeys =
      configOverrides.apiKeys.alchemyApiKeys ?? this.config.alchemyApiKeys;
    this.config.etherscanApiKeys =
      configOverrides.apiKeys.etherscanApiKeys ?? this.config.etherscanApiKeys;

    this.config.covalentApiKey =
      configOverrides.apiKeys.covalentApiKey ?? this.config.covalentApiKey;
    this.config.moralisApiKey =
      configOverrides.apiKeys.moralisApiKey ?? this.config.moralisApiKey;
    this.config.nftScanApiKey =
      configOverrides.apiKeys.nftScanApiKey ?? this.config.nftScanApiKey;
    this.config.poapApiKey =
      configOverrides.apiKeys.poapApiKey ?? this.config.poapApiKey;
    this.config.oklinkApiKey =
      configOverrides.apiKeys.oklinkApiKey ?? this.config.oklinkApiKey;
    this.config.ankrApiKey =
      configOverrides.apiKeys.ankrApiKey ?? this.config.ankrApiKey;
    this.config.dnsServerAddress =
      configOverrides.dnsServerAddress ?? this.config.dnsServerAddress;
    this.config.requestForDataCheckingFrequency =
      configOverrides.requestForDataCheckingFrequency ??
      this.config.requestForDataCheckingFrequency;
    this.config.enableBackupEncryption =
      configOverrides.enableBackupEncryption ??
      this.config.enableBackupEncryption;
    this.config.defaultGoogleCloudBucket =
      configOverrides.defaultGoogleCloudBucket ??
      this.config.defaultGoogleCloudBucket;
    this.config.enableBackupEncryption =
      configOverrides.enableBackupEncryption ??
      this.config.enableBackupEncryption;
    this.config.primaryInfuraKey =
      configOverrides.apiKeys.primaryInfuraKey ?? this.config.primaryInfuraKey;
    this.config.secondaryInfuraKey =
      configOverrides.apiKeys.secondaryInfuraKey ??
      this.config.secondaryInfuraKey;

    // oauth
    this.config.discordOverrides =
      configOverrides.discordOverrides ?? this.config.discordOverrides;
    this.config.twitterOverrides =
      configOverrides.twitterOverrides ?? this.config.twitterOverrides;
  }
  public getConfig(): IExtensionConfig {
    return this.config;
  }
}
