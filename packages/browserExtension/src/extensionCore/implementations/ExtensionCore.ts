import { AxiosAjaxUtils } from "@snickerdoodlelabs/common-utils";
import {
  ConfigProvider,
  SnickerdoodleCore,
  ConfigProvider as CoreConfigProvider,
} from "@snickerdoodlelabs/core";
import {
  DefaultAccountBalances,
  DefaultAccountNFTs,
  IIndexerConfig,
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@snickerdoodlelabs/indexers";
import {
  ChainId,
  IConfigOverrides,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  URLString,
} from "@snickerdoodlelabs/objects";
import {
  DataWalletPersistence,
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@snickerdoodlelabs/persistence";
import { ChromeStorageUtils } from "@snickerdoodlelabs/utils";
import { Container } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { extensionCoreModule } from "@implementations/ExtensionCore.module";
import {
  ICoreListener,
  ICoreListenerType,
  IErrorListener,
  IErrorListenerType,
  IExtensionListener,
  IExtensionListenerType,
  IPortConnectionListener,
  IPortConnectionListenerType,
} from "@interfaces/api";
import { IAccountService, IAccountServiceType } from "@interfaces/business";
import {
  IAccountCookieUtils,
  IAccountCookieUtilsType,
} from "@interfaces/utilities";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@shared/interfaces/configProvider";
import { ExtensionUtils } from "@shared/utils/ExtensionUtils";

export class ExtensionCore {
  protected iocContainer: Container;

  // snickerdooldle Core
  protected core: ISnickerdoodleCore;

  constructor() {
    this.iocContainer = new Container();

    // Elaborate syntax to demonstrate that we can use multiple modules
    this.iocContainer.load(...[extensionCoreModule]);

    const configProvider =
      this.iocContainer.get<IConfigProvider>(IConfigProviderType);
    const config = configProvider.getConfig();

    const coreConfig = {
      controlChainId: config.controlChainId,
      supportedChains: config.supportedChains,
      ipfsFetchBaseUrl: config.ipfsFetchBaseUrl,
      defaultInsightPlatformBaseUrl: config.defaultInsightPlatformBaseUrl,
      covalentApiKey: config.covalentApiKey,
      moralisApiKey: config.moralisApiKey,
      dnsServerAddress: config.dnsServerAddress,
    } as IConfigOverrides;
    const ajax = new AxiosAjaxUtils();

    this.core = new SnickerdoodleCore(coreConfig);

    // Make the core directly injectable
    this.iocContainer.bind(ISnickerdoodleCoreType).toConstantValue(this.core);

    this.tryUnlock();
  }

  public initialize(): ResultAsync<void, never> {
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
      extensionListener.initialize(),
      errorListener.initialize(),
      portConnectionListener.initialize(),
    ]).map(() => {});
  }

  private tryUnlock() {
    const accountCookieUtils = this.iocContainer.get<IAccountCookieUtils>(
      IAccountCookieUtilsType,
    );
    const configProvider =
      this.iocContainer.get<IConfigProvider>(IConfigProviderType);
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountCookieUtils.readAccountInfoFromCookie().andThen((values) => {
      const config = configProvider.getConfig();
      if (values?.length) {
        const { accountAddress, signature, languageCode } = values[0];
        return accountService
          .unlock(accountAddress, signature, languageCode, true)
          .mapErr((e) => {
            ExtensionUtils.openTab({ url: config.onboardingUrl });
            return okAsync(undefined);
          });
      } else {
        ExtensionUtils.openTab({ url: config.onboardingUrl });
        return okAsync(undefined);
      }
    });
  }
}
