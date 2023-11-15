import {
  ChainId,
  IConfigOverrides,
  URLString,
  IExtensionConfigOverrides,
} from "@snickerdoodlelabs/objects";
import { IConfigProvider } from "@synamint-extension-sdk/core/interfaces/utilities";
import { IExtensionConfig } from "@synamint-extension-sdk/shared";
import { injectable } from "inversify";

const ONE_MINUTE_MS = 60000;
interface IDefaultCoreConfig {
  controlChainId: ChainId;
  ipfsFetchBaseUrl: URLString;
  defaultInsightPlatformBaseUrl: URLString;
  domainFilter: string;
  accountBalancePollingIntervalMS: number;
  accountNFTPollingIntervalMS: number;
  accountIndexingPollingIntervalMS: number;
  dataWalletBackupIntervalMS: number;
  requestForDataPollingIntervalMS: number;
}

const defaultCoreConfigs: IDefaultCoreConfig = {
  controlChainId: ChainId(43113),
  ipfsFetchBaseUrl: URLString("https://ipfs-gateway.snickerdoodle.com/ipfs/"),
  defaultInsightPlatformBaseUrl: URLString(
    "https://insight-api.snickerdoodle.com/v0/",
  ),
  domainFilter: "(localhost|chrome://)",
  accountIndexingPollingIntervalMS: ONE_MINUTE_MS,
  accountBalancePollingIntervalMS: ONE_MINUTE_MS,
  accountNFTPollingIntervalMS: ONE_MINUTE_MS,
  dataWalletBackupIntervalMS: ONE_MINUTE_MS,
  requestForDataPollingIntervalMS: 4000,
};

const defaultExtensionConfig: IExtensionConfig = {
  providerKey: "snickerdoodle",
  onboardingURL: URLString("https://datawallet.snickerdoodle.com/"),
};
@injectable()
export class ConfigProvider implements IConfigProvider {
  private _coreConfig: IConfigOverrides = defaultCoreConfigs;
  private _extensionConfig: IExtensionConfig = defaultExtensionConfig;

  constructor() {}
  public setCoreConfigOverrides(configOverrides: IConfigOverrides): void {
    this._coreConfig = {
      ...defaultCoreConfigs,
      ...configOverrides,
    };
  }
  public setExtensionConfigOverrides(
    configOverrides: IExtensionConfigOverrides,
  ): void {
    this._extensionConfig.onboardingURL =
      configOverrides.onboardingURL ?? defaultExtensionConfig.onboardingURL;
    this._extensionConfig.providerKey =
      configOverrides.providerKey ?? defaultExtensionConfig.providerKey;
  }
  public getCoreConfig(): IConfigOverrides {
    return this._coreConfig;
  }
  public getExtensionConfig(): IExtensionConfig {
    return this._extensionConfig;
  }
}
