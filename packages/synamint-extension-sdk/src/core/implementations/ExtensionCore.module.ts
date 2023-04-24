import {
  AxiosAjaxUtils,
  CryptoUtils,
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ICryptoUtils,
  ICryptoUtilsType,
  ITimeUtils,
  ITimeUtilsType,
  TimeUtils,
} from "@snickerdoodlelabs/common-utils";
import { ContainerModule, interfaces } from "inversify";

import { ScamFilterSettingsUtils } from "./utilities/ScamFilterSettingsUtils";

import {
  BrowserTabListener,
  CoreListener,
  ErrorListener,
  ExtensionListener,
  PortConnectionListener,
  RpcCallHandler,
} from "@synamint-extension-sdk/core/implementations/api";
import {
  PortConnectionService,
  AccountService,
  PIIService,
  InvitationService,
  ScamFilterService,
  TokenPriceService,
  UserSiteInteractionService,
  DiscordService,
} from "@synamint-extension-sdk/core/implementations/business";
import {
  PortConnectionRepository,
  AccountRepository,
  PIIRepository,
  InvitationRepository,
  DiscordRepository,
  ScamFilterRepository,
  TokenPriceRepository,
  UserSiteInteractionRepository,
} from "@synamint-extension-sdk/core/implementations/data";
import {
  AccountCookieUtils,
  ContextProvider,
  DataPermissionsUtils,
  ErrorUtils,
} from "@synamint-extension-sdk/core/implementations/utilities";
import { RpcEngineFactory } from "@synamint-extension-sdk/core/implementations/utilities/factory";
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
} from "@synamint-extension-sdk/core/interfaces/api";
import {
  IAccountService,
  IAccountServiceType,
  IDiscordService,
  IDiscordServiceType,
  IInvitationService,
  IInvitationServiceType,
  IPIIService,
  IPIIServiceType,
  IPortConnectionService,
  IPortConnectionServiceType,
  ITokenPriceService,
  ITokenPriceServiceType,
  IUserSiteInteractionService,
  IUserSiteInteractionServiceType,
} from "@synamint-extension-sdk/core/interfaces/business";
import {
  IScamFilterService,
  IScamFilterServiceType,
} from "@synamint-extension-sdk/core/interfaces/business/IScamFilterService";
import {
  IAccountRepository,
  IAccountRepositoryType,
  IInvitationRepository,
  IInvitationRepositoryType,
  IPIIRepository,
  IPIIRepositoryType,
  IPortConnectionRepository,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
  IPortConnectionRepositoryType,
  IUserSiteInteractionRepository,
  IUserSiteInteractionRepositoryType,
  IDiscordRepository,
  IDiscordRepositoryType,
} from "@synamint-extension-sdk/core/interfaces/data";
import {
  IScamFilterRepository,
  IScamFilterRepositoryType,
} from "@synamint-extension-sdk/core/interfaces/data/IScamFilterRepository";
import {
  IAccountCookieUtils,
  IAccountCookieUtilsType,
  IContextProvider,
  IContextProviderType,
  IDataPermissionsUtils,
  IDataPermissionsUtilsType,
  IErrorUtils,
  IErrorUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import {
  IRpcEngineFactory,
  IRpcEngineFactoryType,
} from "@synamint-extension-sdk/core/interfaces/utilities/factory";
import {
  IScamFilterSettingsUtils,
  IScamFilterSettingsUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities/IScamFilterSettingsUtils";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@synamint-extension-sdk/shared/interfaces/configProvider";
import { configProvider } from "@synamint-extension-sdk/shared/utils/ConfigProvider";

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
    bind<ITokenPriceService>(ITokenPriceServiceType)
      .to(TokenPriceService)
      .inSingletonScope();
    bind<IUserSiteInteractionService>(IUserSiteInteractionServiceType)
      .to(UserSiteInteractionService)
      .inSingletonScope();
    bind<IScamFilterService>(IScamFilterServiceType)
      .to(ScamFilterService)
      .inSingletonScope();
    bind<IDiscordService>(IDiscordServiceType)
      .to(DiscordService)
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
    bind<ITokenPriceRepository>(ITokenPriceRepositoryType)
      .to(TokenPriceRepository)
      .inSingletonScope();
    bind<IUserSiteInteractionRepository>(IUserSiteInteractionRepositoryType)
      .to(UserSiteInteractionRepository)
      .inSingletonScope();
    bind<IScamFilterRepository>(IScamFilterRepositoryType)
      .to(ScamFilterRepository)
      .inSingletonScope();
    bind<IDiscordRepository>(IDiscordRepositoryType)
      .to(DiscordRepository)
      .inSingletonScope();
    // Utilities
    bind<IContextProvider>(IContextProviderType)
      .to(ContextProvider)
      .inSingletonScope();
    bind<IConfigProvider>(IConfigProviderType).toConstantValue(configProvider);
    bind<IAccountCookieUtils>(IAccountCookieUtilsType)
      .to(AccountCookieUtils)
      .inSingletonScope();
    bind<IDataPermissionsUtils>(IDataPermissionsUtilsType)
      .to(DataPermissionsUtils)
      .inSingletonScope();
    bind<IScamFilterSettingsUtils>(IScamFilterSettingsUtilsType)
      .to(ScamFilterSettingsUtils)
      .inSingletonScope();
    bind<IErrorUtils>(IErrorUtilsType).to(ErrorUtils).inSingletonScope();
    bind<IAxiosAjaxUtils>(IAxiosAjaxUtilsType)
      .to(AxiosAjaxUtils)
      .inSingletonScope();
    bind<ICryptoUtils>(ICryptoUtilsType).to(CryptoUtils).inSingletonScope();
    bind<ITimeUtils>(ITimeUtilsType).to(TimeUtils).inSingletonScope();

    // Utilities/Factory
    bind<IRpcEngineFactory>(IRpcEngineFactoryType)
      .to(RpcEngineFactory)
      .inSingletonScope();
  },
);
