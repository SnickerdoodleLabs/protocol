import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  EChain,
  IConfigOverrides,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
} from "@snickerdoodlelabs/objects";
import { ChromeStorageUtils } from "@snickerdoodlelabs/utils";
import { Container } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import Browser, { Tabs } from "webextension-polyfill";

import { extensionCoreModule } from "@synamint-extension-sdk/core/implementations/ExtensionCore.module";
import {
  IBrowserTabListener,
  IBrowserTabListenerType,
  ICoreListener,
  ICoreListenerType,
  IErrorListener,
  IErrorListenerType,
  IExtensionListener,
  IExtensionListenerType,
  IPortConnectionListener,
  IPortConnectionListenerType,
} from "@synamint-extension-sdk/core/interfaces/api";
import {
  IAccountService,
  IAccountServiceType,
} from "@synamint-extension-sdk/core/interfaces/business";
import {
  IAccountCookieUtils,
  IAccountCookieUtilsType,
  IErrorUtils,
  IErrorUtilsType,
  IConfigProvider,
  IConfigProviderType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { ExtensionUtils } from "@synamint-extension-sdk/extensionShared";
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
      supportedChains: config.supportedChains,
      ipfsFetchBaseUrl: config.ipfsFetchBaseUrl,
      defaultInsightPlatformBaseUrl: config.defaultInsightPlatformBaseUrl,
      covalentApiKey: config.covalentApiKey,
      moralisApiKey: config.moralisApiKey,
      nftScanApiKey: config.nftScanApiKey,
      poapApiKey: config.poapApiKey,
      oklinkApiKey: config.oklinkApiKey,
      ankrApiKey: config.ankrApiKey,

      dnsServerAddress: config.dnsServerAddress,
      ceramicNodeUrl: config.ceramicNodeUrl,
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
    } as IConfigOverrides;

    this.core = new SnickerdoodleCore(
      coreConfig,
      new ChromeStorageUtils(),
      undefined,
      undefined,
    );

    // Make the core directly injectable
    this.iocContainer.bind(ISnickerdoodleCoreType).toConstantValue(this.core);

    this.tryUnlock();
  }

  public initialize(): ResultAsync<void, never> {
    const browserTabListener = this.iocContainer.get<IBrowserTabListener>(
      IBrowserTabListenerType,
    );
    const coreListener =
      this.iocContainer.get<ICoreListener>(ICoreListenerType);
    const extensionListener = this.iocContainer.get<IExtensionListener>(
      IExtensionListenerType,
    );
    const errorListener =
      this.iocContainer.get<IErrorListener>(IErrorListenerType);
    const portConnectionListener =
      this.iocContainer.get<IPortConnectionListener>(
        IPortConnectionListenerType,
      );
    return ResultUtils.combine([
      coreListener.initialize(),
      browserTabListener.initialize(),
      extensionListener.initialize(),
      errorListener.initialize(),
      portConnectionListener.initialize(),
    ]).map(() => {});
  }

  private tryUnlock(): ResultAsync<void, Error> {
    const accountCookieUtils = this.iocContainer.get<IAccountCookieUtils>(
      IAccountCookieUtilsType,
    );
    const configProvider =
      this.iocContainer.get<IConfigProvider>(IConfigProviderType);

    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);

    const errorUtils = this.iocContainer.get<IErrorUtils>(IErrorUtilsType);

    const config = configProvider.getConfig();

    return ResultUtils.combine([
      accountCookieUtils.readAccountInfoFromCookie(),
      accountCookieUtils.readDataWalletAddressFromCookie(),
    ])
      .andThen(([unlockParamsArr, dataWalletAddressOnCookie]) => {
        console.log(
          `Data wallet address on Cookie ${dataWalletAddressOnCookie}`,
        );
        if (unlockParamsArr?.length) {
          const { accountAddress, signature, languageCode, chain } =
            unlockParamsArr[0];
          return accountService
            .getDataWalletForAccount(
              accountAddress,
              signature,
              languageCode,
              chain ?? EChain.EthereumMainnet,
            )
            .andThen((dataWalletAddress) => {
              console.log(
                `Decrypted data wallet address for account ${accountAddress} ${dataWalletAddress}`,
              );
              if (
                !dataWalletAddress ||
                (dataWalletAddressOnCookie &&
                  dataWalletAddressOnCookie != dataWalletAddress)
              ) {
                console.log(
                  `Datawallet was not able to be unlocked with account address ${accountAddress}`,
                );
                return accountCookieUtils
                  .removeAccountInfoFromCookie(accountAddress)
                  .map(() => {
                    console.log(`Account ${accountAddress} removed`);
                    this.tryUnlock();
                  });
              }
              return accountService.unlock(
                accountAddress,
                signature,
                chain ?? EChain.EthereumMainnet,
                languageCode,
                true,
              );
            });
        } else {
          if (dataWalletAddressOnCookie) {
            console.log(
              `No account info found on cookie for auto unlock ${dataWalletAddressOnCookie} is removing`,
            );
            return accountCookieUtils
              .removeDataWalletAddressFromCookie()
              .andThen(() => {
                return ExtensionUtils.openUrlOrSwitchToUrlTab(
                  config.onboardingUrl,
                );
              });
          }
          return ExtensionUtils.openUrlOrSwitchToUrlTab(config.onboardingUrl);
        }
      })
      .orElse((e) => {
        errorUtils.emit(e);
        return ExtensionUtils.openUrlOrSwitchToUrlTab(config.onboardingUrl);
      });
  }
}
