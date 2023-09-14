import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  AjaxError,
  BlockchainProviderError,
  IConfigOverrides,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ChromeStorageUtils } from "@snickerdoodlelabs/utils";
import { Container } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { extensionCoreModule } from "@synamint-extension-sdk/core/implementations/ExtensionCore.module";
import {
  IBrowserTabListener,
  IBrowserTabListenerType,
  ICoreListener,
  ICoreListenerType,
  IErrorListener,
  IErrorListenerType,
  IPortConnectionListener,
  IPortConnectionListenerType,
} from "@synamint-extension-sdk/core/interfaces/api";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { IExtensionConfigOverrides } from "@synamint-extension-sdk/shared/interfaces/IExtensionConfig";

export class ExtensionCore {
  protected iocContainer: Container;

  // snickerdooldle Core
  protected core: ISnickerdoodleCore;

  constructor(configOverrides: IExtensionConfigOverrides) {
    this.iocContainer = new Container();

    // Elaborate syntax to demonstrate that we can use multiple modules
    this.iocContainer.load(...[extensionCoreModule]);

    const configProvider =
      this.iocContainer.get<IConfigProvider>(IConfigProviderType);
    // override configs
    configProvider.setConfigOverrides(configOverrides);

    const config = configProvider.getConfig();

    const SIX_HOURS_MS = 21600000;

    // These values are the defaults in the config provider
    const UNREALISTIC_BUT_WORKING_POLL_INTERVAL = 5000;
    const UNREALISTIC_BUT_WORKING_BACKUP_INTERVAL = 10000;
    const coreConfig = {
      controlChainId: config.controlChainId,
      ipfsFetchBaseUrl: config.ipfsFetchBaseUrl,
      defaultInsightPlatformBaseUrl: config.defaultInsightPlatformBaseUrl,
      alchemyApiKeys: config.alchemyApiKeys,
      etherscanApiKeys: config.etherscanApiKeys,
      covalentApiKey: config.covalentApiKey,
      moralisApiKey: config.moralisApiKey,
      nftScanApiKey: config.nftScanApiKey,
      poapApiKey: config.poapApiKey,
      oklinkApiKey: config.oklinkApiKey,
      ankrApiKey: config.ankrApiKey,
      bluezApiKey: config.bluezApiKey,

      dnsServerAddress: config.dnsServerAddress,
      accountBalancePollingIntervalMS: config.portfolioPollingIntervalMS,
      accountIndexingPollingIntervalMS: config.transactionPollingIntervalMS,
      accountNFTPollingIntervalMS: config.portfolioPollingIntervalMS,
      dataWalletBackupIntervalMS: config.backupPollingIntervalMS,
      requestForDataCheckingFrequency: config.requestForDataCheckingFrequency,
      domainFilter: config.domainFilter,
      defaultGoogleCloudBucket: config.defaultGoogleCloudBucket,
      enableBackupEncryption: config.enableBackupEncryption,
      discordOverrides: config.discordOverrides,
      twitterOverrides: config.twitterOverrides,
      primaryInfuraKey: config.primaryInfuraKey,
      secondaryInfuraKey: config.secondaryInfuraKey,
      devChainProviderURL: config.devChainProviderURL,

      dropboxAppKey: config.dropboxAppKey,
      dropboxAppSecret: config.dropboxAppSecret,
      dropboxRedirectUri: config.dropboxRedirectUri,
    } as IConfigOverrides;

    this.core = new SnickerdoodleCore(
      coreConfig,
      new ChromeStorageUtils(),
      undefined,
    );

    // Make the core directly injectable
    this.iocContainer.bind(ISnickerdoodleCoreType).toConstantValue(this.core);
  }

  public initialize(): ResultAsync<
    void,
    PersistenceError | UninitializedError | BlockchainProviderError | AjaxError
  > {
    return this.core
      .initialize()
      .andThen(() => {
        const browserTabListener = this.iocContainer.get<IBrowserTabListener>(
          IBrowserTabListenerType,
        );
        const coreListener =
          this.iocContainer.get<ICoreListener>(ICoreListenerType);
        const errorListener =
          this.iocContainer.get<IErrorListener>(IErrorListenerType);
        const portConnectionListener =
          this.iocContainer.get<IPortConnectionListener>(
            IPortConnectionListenerType,
          );
        return ResultUtils.combine([
          coreListener.initialize(),
          browserTabListener.initialize(),
          errorListener.initialize(),
          portConnectionListener.initialize(),
        ]);
      })
      .map(() => {});
  }
}
