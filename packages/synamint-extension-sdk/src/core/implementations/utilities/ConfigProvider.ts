import {
  ChainId,
  IConfigOverrides,
  URLString,
  IExtensionConfigOverrides,
  IExtensionSdkConfigOverrides,
} from "@snickerdoodlelabs/objects";
import deepmerge from "deepmerge";
import { injectable } from "inversify";

import { IConfigProvider } from "@synamint-extension-sdk/core/interfaces/utilities";
import { IExtensionConfig } from "@synamint-extension-sdk/shared";
import { extractObject } from "@synamint-extension-sdk/utils";

const ONE_MINUTE_MS = 60000;

const defaultExtensionConfig: IExtensionConfig = {
  providerKey: "snickerdoodle",
  onboardingURL: URLString("https://datawallet.snickerdoodle.com/"),
};

const defaultCoreConfigs: IConfigOverrides = {
  controlChainId: ChainId(43113),
  primaryInfuraKey: "a6271a49218848a7ad939ee62d225914",
  ipfsFetchBaseUrl: URLString("https://ipfs-gateway.snickerdoodle.com/ipfs/"),
  defaultInsightPlatformBaseUrl: URLString(
    "https://insight-api.snickerdoodle.com/v0/",
  ),
  discordOverrides: {
    oauthRedirectUrl: URLString(
      `${defaultExtensionConfig.onboardingURL}settings`,
    ),
  },
  dropboxRedirectUri: URLString(
    `${defaultExtensionConfig.onboardingURL}settings`,
  ),
  domainFilter: "(localhost|chrome://)",
  accountIndexingPollingIntervalMS: ONE_MINUTE_MS,
  accountBalancePollingIntervalMS: ONE_MINUTE_MS,
  accountNFTPollingIntervalMS: ONE_MINUTE_MS,
  dataWalletBackupIntervalMS: ONE_MINUTE_MS,
  requestForDataPollingIntervalMS: 4000,

  // api keys

  alchemyApiKeys: {
    Arbitrum: "_G9cUGHUQqvD2ro5zDaTAFXeaTcNgQiF",
    Astar: "Tk2NcwnHwrmRvzZCkqgSr6fOYIgH7xh7",
    Mumbai: "UA7tIJ6CdCE1351h24CQUE-MNCIV3DSf",
    Optimism: "f3mMgv03KKiX8h-pgOc9ZZyu7F9ECcHG",
    Polygon: "el_YkQK0DMQqqGlgXPO5gm8g6WmpdNfX",
    Solana: "pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
    SolanaTestnet: "Fko-iHgKEnUKTkM1SvnFMFMw1AvTVAtg",
  },
  etherscanApiKeys: {
    Ethereum: "6GCDQU7XSS8TW95M9H5RQ6SS4BZS1PY8B7",
    Polygon: "G4XTF3MERFUKFNGANGVY6DTMX1WKAD6V4G",
    Avalanche: "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1",
    Binance: "KRWYKPQ3CDD81RXUM5H5UMWVXPJP4C29AY",
    Moonbeam: "EE9QD4D9TE7S7D6C8WVJW592BGMA4HYH71",
    Optimism: "XX9XPVXCBA9VCIQ3YBIZHET5U3BR1DG8B3",
    Arbitrum: "CTJ33WVF49E4UG6EYN6P4KSFC749JPYAFV",
    Gnosis: "J7G8U27J1Y9F88E1E56CNNG2K3H98GF4XE",
    Fuji: "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1",
  },
  spaceAndTimeCredentials: {
    UserId: "",
    PrivateKey: "",
  },

  covalentApiKey: "ckey_ee277e2a0e9542838cf30325665",
  moralisApiKey:
    "aqy6wZJX3r0XxYP9b8EyInVquukaDuNL9SfVtuNxvPqJrrPon07AvWUmlgOvp5ag",
  poapApiKey:
    "wInY1o7pH1yAGBYKcbz0HUIXVHv2gjNTg4v7OQ70hykVdgKlXU3g7GGaajmEarYIX4jxCwm55Oim7kYZeML6wfLJAsm7MzdvlH1k0mKFpTRLXX1AXDIwVQer51SMeuQm",
  ankrApiKey:
    "74bbdfc0dea96f85aadde511a4fe8905342c864202f890ece7d0b8d1c60df637",
  bluezApiKey: "aed4aab2cbc573bbf8e7c6b448c916e5",
  raribleApiKey: "c5855db8-08ef-409f-9947-e46c141af1b4",
  blockvisionKey: "2WaEih5fqe8NUavbvaR2PSuVSSp",

  nftScanApiKey: "lusr87vNmTtHGMmktlFyi4Nt",
  oklinkApiKey: "700c2f71-a4e2-4a85-b87f-58c8a341d1bf",
};

@injectable()
export class ConfigProvider implements IConfigProvider {
  private _coreConfig: IConfigOverrides = defaultCoreConfigs;
  private _extensionConfig: IExtensionConfig = defaultExtensionConfig;

  constructor() {}
  public setConfigOverrides(
    configOverrides: IExtensionSdkConfigOverrides,
  ): void {
    this.setCoreConfigOverrides(
      extractObject<IConfigOverrides>(configOverrides),
    );
    this.setExtensionConfigOverrides(
      extractObject<IExtensionConfigOverrides>(configOverrides),
    );
  }
  public setCoreConfigOverrides(configOverrides: IConfigOverrides): void {
    this._coreConfig = deepmerge(defaultCoreConfigs, configOverrides);
  }
  public setExtensionConfigOverrides(
    configOverrides: IExtensionConfigOverrides,
  ): void {
    this._extensionConfig = deepmerge(defaultExtensionConfig, configOverrides);
  }

  public getCoreConfig(): IConfigOverrides {
    return this._coreConfig;
  }
  public getExtensionConfig(): IExtensionConfig {
    return this._extensionConfig;
  }
}
