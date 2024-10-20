/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  IConfigOverrides,
  ISnickerdoodleCore,
  URLString,
} from "@snickerdoodlelabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IConfigProvider,
  IConfigProviderType,
  ICoreProvider,
} from "@core-iframe/interfaces/utilities/index";

@injectable()
export class CoreProvider implements ICoreProvider {
  protected corePromise: Promise<ISnickerdoodleCore>;
  protected corePromiseResolve: ((ISnickerdoodleCore) => void) | null = null;
  protected core: ISnickerdoodleCore | null = null;

  public constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {
    this.corePromise = new Promise((resolve) => {
      this.corePromiseResolve = resolve;
    });
  }
  public getCore(): ResultAsync<ISnickerdoodleCore, Error> {
    return ResultAsync.fromSafePromise(this.corePromise);
  }

  public setConfig(config: IConfigOverrides): ResultAsync<void, Error> {
    console.log(
      "Setting configuration overrides and creating Snickerdoodle Core instance",
    );

    // A few critical pieces of configuration are baked into the iframe at build time.
    // This is a security measure- you don't want a bad site overriding certain
    // values to dangerous ones willy-nilly.
    const immutableConfig = this.configProvider.getConfig();
    config.controlChainId = immutableConfig.controlChainId;
    config.ipfsFetchBaseUrl = immutableConfig.ipfsFetchBaseUrl;
    config.defaultInsightPlatformBaseUrl =
      immutableConfig.defaultInsightPlatformBaseUrl;
    config.devChainProviderURL =
      immutableConfig.devChainProviderURL ?? undefined;
    config.accountBalancePollingIntervalMS =
      immutableConfig.portfolioPollingIntervalMS;
    config.accountIndexingPollingIntervalMS =
      immutableConfig.transactionPollingIntervalMS;
    config.dataWalletBackupIntervalMS = immutableConfig.backupPollingIntervalMS;
    config.requestForDataPollingIntervalMS =
      immutableConfig.requestForDataPollingIntervalMS;

    // This probably needs to go away entirely
    config.enableBackupEncryption = false;

    // We may be guaranteed some API keys
    config.primaryInfuraKey =
      config.primaryInfuraKey ?? immutableConfig.defaultKeys.primaryInfuraKey;
    config.primaryRPCProviderURL =
      config.primaryRPCProviderURL ??
      immutableConfig.defaultKeys.primaryRPCProviderURL;
    config.secondaryInfuraKey =
      config.secondaryInfuraKey ??
      immutableConfig.defaultKeys.secondaryInfuraKey;
    config.secondaryRPCProviderURL =
      config.secondaryRPCProviderURL ??
      immutableConfig.defaultKeys.secondaryRPCProviderURL;

    // Alchemy
    config.alchemyApiKeys =
      config.alchemyApiKeys ?? immutableConfig.defaultKeys.alchemyApiKeys;
    config.alchemyApiKeys.Arbitrum =
      config.alchemyApiKeys.Arbitrum ??
      immutableConfig.defaultKeys.alchemyApiKeys.Arbitrum;
    config.alchemyApiKeys.Astar =
      config.alchemyApiKeys.Astar ??
      immutableConfig.defaultKeys.alchemyApiKeys.Astar;
    config.alchemyApiKeys.Amoy =
      config.alchemyApiKeys.Amoy ??
      immutableConfig.defaultKeys.alchemyApiKeys.Amoy;
    config.alchemyApiKeys.Optimism =
      config.alchemyApiKeys.Optimism ??
      immutableConfig.defaultKeys.alchemyApiKeys.Optimism;
    config.alchemyApiKeys.Polygon =
      config.alchemyApiKeys.Polygon ??
      immutableConfig.defaultKeys.alchemyApiKeys.Polygon;
    config.alchemyApiKeys.Solana =
      config.alchemyApiKeys.Solana ??
      immutableConfig.defaultKeys.alchemyApiKeys.Solana;
    config.alchemyApiKeys.SolanaTestnet =
      config.alchemyApiKeys.SolanaTestnet ??
      immutableConfig.defaultKeys.alchemyApiKeys.SolanaTestnet;

    // Etherscan
    config.etherscanApiKeys =
      config.etherscanApiKeys ?? immutableConfig.defaultKeys.etherscanApiKeys;
    config.etherscanApiKeys.Ethereum =
      config.etherscanApiKeys.Ethereum ??
      immutableConfig.defaultKeys.etherscanApiKeys.Ethereum;
    config.etherscanApiKeys.Polygon =
      config.etherscanApiKeys.Polygon ??
      immutableConfig.defaultKeys.etherscanApiKeys.Polygon;
    config.etherscanApiKeys.Avalanche =
      config.etherscanApiKeys.Avalanche ??
      immutableConfig.defaultKeys.etherscanApiKeys.Avalanche;
    config.etherscanApiKeys.Binance =
      config.etherscanApiKeys.Binance ??
      immutableConfig.defaultKeys.etherscanApiKeys.Binance;
    config.etherscanApiKeys.Moonbeam =
      config.etherscanApiKeys.Moonbeam ??
      immutableConfig.defaultKeys.etherscanApiKeys.Moonbeam;
    config.etherscanApiKeys.Optimism =
      config.etherscanApiKeys.Optimism ??
      immutableConfig.defaultKeys.etherscanApiKeys.Optimism;
    config.etherscanApiKeys.Arbitrum =
      config.etherscanApiKeys.Arbitrum ??
      immutableConfig.defaultKeys.etherscanApiKeys.Arbitrum;
    config.etherscanApiKeys.Gnosis =
      config.etherscanApiKeys.Gnosis ??
      immutableConfig.defaultKeys.etherscanApiKeys.Gnosis;
    config.etherscanApiKeys.Fuji =
      config.etherscanApiKeys.Fuji ??
      immutableConfig.defaultKeys.etherscanApiKeys.Fuji;

    // Space And Time
    config.spaceAndTimeCredentials =
      config.spaceAndTimeCredentials ??
      immutableConfig.defaultKeys.spaceAndTimeCredentials;
    config.spaceAndTimeCredentials.userId =
      config.spaceAndTimeCredentials?.userId ??
      immutableConfig.defaultKeys.spaceAndTimeCredentials.userId;
    config.spaceAndTimeCredentials.privateKey =
      config.spaceAndTimeCredentials?.privateKey ??
      immutableConfig.defaultKeys.spaceAndTimeCredentials.privateKey;

    // Other Indexers
    config.expandApiKey =
      config.expandApiKey ?? immutableConfig.defaultKeys.expandApiKey;
    config.covalentApiKey =
      config.covalentApiKey ?? immutableConfig.defaultKeys.covalentApiKey;
    config.moralisApiKey =
      config.moralisApiKey ?? immutableConfig.defaultKeys.moralisApiKey;
    config.nftScanApiKey =
      config.nftScanApiKey ?? immutableConfig.defaultKeys.nftScanApiKey;
    config.poapApiKey =
      config.poapApiKey ?? immutableConfig.defaultKeys.poapApiKey;
    config.oklinkApiKey =
      config.oklinkApiKey ?? immutableConfig.defaultKeys.oklinkApiKey;
    config.ankrApiKey =
      config.ankrApiKey ?? immutableConfig.defaultKeys.ankrApiKey;
    config.bluezApiKey =
      config.bluezApiKey ?? immutableConfig.defaultKeys.bluezApiKey;
    config.raribleApiKey =
      config.raribleApiKey ?? immutableConfig.defaultKeys.raribleApiKey;
    config.blockvisionKey =
      config.blockvisionKey ?? immutableConfig.defaultKeys.blockvisionKey;

    // we may move the following lines to immutable config section
    // or we can hoist the onboarding url to the core level
    (config.discordOverrides = config.discordOverrides ?? {
      oauthRedirectUrl: this._getDefaultOauthRedirectUrl(),
    }),
      (config.dropboxRedirectUri =
        config.dropboxRedirectUri ?? this._getDefaultOauthRedirectUrl()),
      (this.core = new SnickerdoodleCore(config));

    // Now we can create the actual snickerdoodle core instance
    return this.core.initialize().map(() => {
      this.corePromiseResolve!(this.core);
    });
  }

  // it returns the SPA url dynamically based on the current window location
  // if the url is not sandbox or production url, it will return the localhost url that we set for local env
  // it will be wrong for docker local docker container

  private _getDefaultOauthRedirectUrl(): URLString {
    return window.location.origin.includes("iframe")
      ? URLString(
          `${window.location.origin.replace("iframe", "datawallet")}/settings`,
        )
      : URLString("https://localhost:9005/settings");
  }
}
