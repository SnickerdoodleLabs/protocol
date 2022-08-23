import {
  AxiosAjaxUtils,
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  TimeUtils,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { ConfigProvider } from "@snickerdoodlelabs/core";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@snickerdoodlelabs/persistence";
import { ContainerModule, interfaces } from "inversify";

import {
  BrowserTabListener,
  CoreListener,
  ErrorListener,
  ExtensionListener,
  PortConnectionListener,
  RpcCallHandler,
} from "@implementations/api";
import {
  PortConnectionService,
  AccountService,
  PIIService,
  InvitationService,
  UserSiteInteractionService,
} from "@implementations/business";
import {
  PortConnectionRepository,
  AccountRepository,
  PIIRepository,
  InvitationRepository,
  UserSiteInteractionRepository,
} from "@implementations/data";
import {
  AccountCookieUtils,
  ContextProvider,
  ErrorUtils,
} from "@implementations/utilities";
import { RpcEngineFactory } from "@implementations/utilities/factory";
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
  IRpcCallHandler,
  IRpcCallHandlerType,
} from "@interfaces/api";
import {
  IAccountService,
  IAccountServiceType,
  IInvitationService,
  IInvitationServiceType,
  IPIIService,
  IPIIServiceType,
  IPortConnectionService,
  IPortConnectionServiceType,
  IUserSiteInteractionService,
  IUserSiteInteractionServiceType,
} from "@interfaces/business";
import {
  IAccountRepository,
  IAccountRepositoryType,
  IInvitationRepository,
  IInvitationRepositoryType,
  IPIIRepository,
  IPIIRepositoryType,
  IPortConnectionRepository,
  IPortConnectionRepositoryType,
  IUserSiteInteractionRepository,
  IUserSiteInteractionRepositoryType,
} from "@interfaces/data";
import {
  IAccountCookieUtils,
  IAccountCookieUtilsType,
  IContextProvider,
  IContextProviderType,
  IErrorUtils,
  IErrorUtilsType,
} from "@interfaces/utilities";
import {
  IRpcEngineFactory,
  IRpcEngineFactoryType,
} from "@interfaces/utilities/factory";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@shared/interfaces/configProvider";
import configProvider from "@shared/utils/ConfigProvider";

export const extensionCoreModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    // API
    bind<IBrowserTabListener>(IBrowserTabListenerType)
      .to(BrowserTabListener)
      .inSingletonScope();
    bind<ICoreListener>(ICoreListenerType).to(CoreListener).inSingletonScope();
    bind<IErrorListener>(IErrorListenerType)
      .to(ErrorListener)
      .inSingletonScope();
    bind<IExtensionListener>(IExtensionListenerType)
      .to(ExtensionListener)
      .inSingletonScope();
    bind<IPortConnectionListener>(IPortConnectionListenerType)
      .to(PortConnectionListener)
      .inSingletonScope();
    bind<IRpcCallHandler>(IRpcCallHandlerType)
      .to(RpcCallHandler)
      .inSingletonScope();

    // Business=
    bind<IAccountService>(IAccountServiceType)
      .to(AccountService)
      .inSingletonScope();
    bind<IInvitationService>(IInvitationServiceType)
      .to(InvitationService)
      .inSingletonScope();
    bind<IPortConnectionService>(IPortConnectionServiceType)
      .to(PortConnectionService)
      .inSingletonScope();
    bind<IPIIService>(IPIIServiceType).to(PIIService).inSingletonScope();
    bind<IUserSiteInteractionService>(IUserSiteInteractionServiceType)
      .to(UserSiteInteractionService)
      .inSingletonScope();

    // Data
    bind<IAccountRepository>(IAccountRepositoryType)
      .to(AccountRepository)
      .inSingletonScope();
    bind<IPortConnectionRepository>(IPortConnectionRepositoryType)
      .to(PortConnectionRepository)
      .inSingletonScope();
    bind<IPIIRepository>(IPIIRepositoryType)
      .to(PIIRepository)
      .inSingletonScope();
    bind<IInvitationRepository>(IInvitationRepositoryType)
      .to(InvitationRepository)
      .inSingletonScope();
    bind<IUserSiteInteractionRepository>(IUserSiteInteractionRepositoryType)
      .to(UserSiteInteractionRepository)
      .inSingletonScope();

    // Utilities
    bind<IContextProvider>(IContextProviderType)
      .to(ContextProvider)
      .inSingletonScope();
    bind<IConfigProvider>(IConfigProviderType).toConstantValue(configProvider);
    bind<IAccountCookieUtils>(IAccountCookieUtilsType)
      .to(AccountCookieUtils)
      .inSingletonScope();
    bind<IErrorUtils>(IErrorUtilsType).to(ErrorUtils).inSingletonScope();
    bind<IAxiosAjaxUtils>(IAxiosAjaxUtilsType)
      .to(AxiosAjaxUtils)
      .inSingletonScope();
    bind<ITimeUtils>(ITimeUtilsType).to(TimeUtils).inSingletonScope();

    // Utilities/Factory
    bind<IRpcEngineFactory>(IRpcEngineFactoryType)
      .to(RpcEngineFactory)
      .inSingletonScope();
  },
);
