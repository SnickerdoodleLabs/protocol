import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
  LogUtils,
  TimeUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  CryptoUtils,
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/node-utils";
import {
  IStorageUtils,
  IStorageUtilsType,
  LocalStorageUtils,
} from "@snickerdoodlelabs/utils";
import { ContainerModule, interfaces } from "inversify";

import { CoreListener } from "@core-iframe/implementations/api/index";
import {
  AccountService,
  InvitationService,
} from "@core-iframe/implementations/business/index";
import {
  ConfigProvider,
  CoreProvider,
  IFrameContextProvider,
} from "@core-iframe/implementations/utilities/index";
import {
  ICoreListener,
  ICoreListenerType,
} from "@core-iframe/interfaces/api/index";
import {
  IAccountService,
  IAccountServiceType,
  IInvitationService,
  IInvitationServiceType,
} from "@core-iframe/interfaces/business/index";
import {
  IConfigProvider,
  IConfigProviderType,
  ICoreProvider,
  ICoreProviderType,
  IIFrameContextProvider,
  IIFrameContextProviderType,
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
    bind<IInvitationService>(IInvitationServiceType)
      .to(InvitationService)
      .inSingletonScope();
    // #endregion

    // #region Data
    // #endregion

    // #region Utilities
    bind<IStorageUtils>(IStorageUtilsType)
      .to(LocalStorageUtils)
      .inSingletonScope();
    bind<IIFrameContextProvider>(IIFrameContextProviderType)
      .to(IFrameContextProvider)
      .inSingletonScope();
    bind<IConfigProvider>(IConfigProviderType)
      .to(ConfigProvider)
      .inSingletonScope();
    bind<ICoreProvider>(ICoreProviderType).to(CoreProvider).inSingletonScope();
    bind<ICryptoUtils>(ICryptoUtilsType).to(CryptoUtils).inSingletonScope();
    bind<ILogUtils>(ILogUtilsType).to(LogUtils).inSingletonScope();
    bind<ITimeUtils>(ITimeUtilsType).to(TimeUtils).inSingletonScope();
    // #endregion
  },
);
