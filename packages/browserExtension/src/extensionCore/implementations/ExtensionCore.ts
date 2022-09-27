import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  EChain,
  IConfigOverrides,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
} from "@snickerdoodlelabs/objects";
import { ChromeStorageUtils } from "@snickerdoodlelabs/utils";
import { Container } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { extensionCoreModule } from "@implementations/ExtensionCore.module";
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
        const { accountAddress, signature, languageCode, chain } = values[0];
        return accountService
          .areValidParamsToUnlockExistingWallet(
            accountAddress,
            signature,
            languageCode,
            chain ?? EChain.EthereumMainnet,
          )
          .andThen((isValid) => {
            if (isValid) {
              console.log(
                `Datawallet is unlocking with account address ${accountAddress}`,
              );
              return accountService.unlock(
                accountAddress,
                signature,
                chain ?? EChain.EthereumMainnet,
                languageCode,
                true,
              );
            } else {
              console.log(
                `Datawallet was not able to be unlocked with account address ${accountAddress}`,
              );
              return accountCookieUtils
                .removeAccountInfoFromCookie(accountAddress)
                .andThen(() => {
                  return this.tryUnlock();
                });
            }
          })
          .mapErr((e) => {
            return ExtensionUtils.openTab({ url: config.onboardingUrl });
          });
      } else {
        return ExtensionUtils.openTab({ url: config.onboardingUrl });
      }
    });
  }
}
