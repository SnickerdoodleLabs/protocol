import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  SnickerdoodleCore,
  ConfigProvider as CoreConfigProvider,
} from "@snickerdoodlelabs/core";
import {
  DefaultAccountBalances,
  DefaultAccountNFTs,
} from "@snickerdoodlelabs/indexers";
import {
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
} from "@snickerdoodlelabs/objects";
import { ChromeStoragePersistence } from "@snickerdoodlelabs/persistence";
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

    const ajaxUtils =
      this.iocContainer.get<IAxiosAjaxUtils>(IAxiosAjaxUtilsType);
    const coreConfigProvider = new CoreConfigProvider();
    const persistence = new ChromeStoragePersistence(
      coreConfigProvider,
      new DefaultAccountNFTs(coreConfigProvider, ajaxUtils),
      new DefaultAccountBalances(coreConfigProvider, ajaxUtils),
    );

    this.core = new SnickerdoodleCore(undefined, persistence);

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
