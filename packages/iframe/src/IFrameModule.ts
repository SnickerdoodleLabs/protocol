import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
  LogUtils,
  TimeUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  IStorageUtils,
  IStorageUtilsType,
  LocalStorageUtils,
} from "@snickerdoodlelabs/utils";
import { ContainerModule, interfaces } from "inversify";

import { CoreListener } from "@core-iframe/implementations/api/index";
import { AccountService } from "@core-iframe/implementations/business/index";
import {
  ConfigProvider,
  CoreProvider,
} from "@core-iframe/implementations/utilities/index";
import {
  ICoreListener,
  ICoreListenerType,
} from "@core-iframe/interfaces/api/index";
import {
  IAccountService,
  IAccountServiceType,
} from "@core-iframe/interfaces/business/index";
import {
  IConfigProvider,
  IConfigProviderType,
  ICoreProvider,
  ICoreProviderType,
} from "@core-iframe/interfaces/utilities/index";

export const iframeModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    // #region API
    bind<ICoreListener>(ICoreListenerType).to(CoreListener).inSingletonScope();
    // #endregion

    // #region Business
    bind<IAccountService>(IAccountServiceType)
      .to(AccountService)
      .inSingletonScope();
    // #endregion

    // #region Data
    // #endregion

    // #region Utilities
    bind<IStorageUtils>(IStorageUtilsType)
      .to(LocalStorageUtils)
      .inSingletonScope();
    bind<IConfigProvider>(IConfigProviderType)
      .to(ConfigProvider)
      .inSingletonScope();
    bind<ICoreProvider>(ICoreProviderType).to(CoreProvider).inSingletonScope();
    bind<ILogUtils>(ILogUtilsType).to(LogUtils).inSingletonScope();
    bind<ITimeUtils>(ITimeUtilsType).to(TimeUtils).inSingletonScope();
    // #endregion
  },
);
