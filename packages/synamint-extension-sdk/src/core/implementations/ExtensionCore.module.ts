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

import {
  BrowserTabListener,
  CoreListener,
  ErrorListener,
  PortConnectionListener,
  RpcCallHandler,
} from "@synamint-extension-sdk/core/implementations/api/index.js";
import {
  AccountService,
  DiscordService,
  InvitationService,
  PIIService,
  PortConnectionService,
  ScamFilterService,
  TokenPriceService,
  TwitterService,
  UserSiteInteractionService,
} from "@synamint-extension-sdk/core/implementations/business/index.js";
import {
  AccountRepository,
  InvitationRepository,
  PIIRepository,
  PortConnectionRepository,
  ScamFilterRepository,
  TokenPriceRepository,
  UserSiteInteractionRepository,
} from "@synamint-extension-sdk/core/implementations/data/index.js";
import { RpcEngineFactory } from "@synamint-extension-sdk/core/implementations/utilities/factory/index.js";
import {
  AccountCookieUtils,
  ContextProvider,
  DataPermissionsUtils,
  ErrorUtils,
  ScamFilterSettingsUtils,
  ConfigProvider,
} from "@synamint-extension-sdk/core/implementations/utilities/index.js";
import {
  IBrowserTabListener,
  IBrowserTabListenerType,
  ICoreListener,
  ICoreListenerType,
  IErrorListener,
  IErrorListenerType,
  IPortConnectionListener,
  IPortConnectionListenerType,
  IRpcCallHandler,
  IRpcCallHandlerType,
} from "@synamint-extension-sdk/core/interfaces/api/index.js";
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
  IScamFilterService,
  IScamFilterServiceType,
  ITokenPriceService,
  ITokenPriceServiceType,
  ITwitterService,
  ITwitterServiceType,
  IUserSiteInteractionService,
  IUserSiteInteractionServiceType,
} from "@synamint-extension-sdk/core/interfaces/business/index.js";
import {
  IAccountRepository,
  IAccountRepositoryType,
  IInvitationRepository,
  IInvitationRepositoryType,
  IPIIRepository,
  IPIIRepositoryType,
  IPortConnectionRepository,
  IPortConnectionRepositoryType,
  IScamFilterRepository,
  IScamFilterRepositoryType,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
  IUserSiteInteractionRepository,
  IUserSiteInteractionRepositoryType,
} from "@synamint-extension-sdk/core/interfaces/data/index.js";
import {
  IRpcEngineFactory,
  IRpcEngineFactoryType,
} from "@synamint-extension-sdk/core/interfaces/utilities/factory/index.js";
import {
  IAccountCookieUtils,
  IAccountCookieUtilsType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IDataPermissionsUtils,
  IDataPermissionsUtilsType,
  IErrorUtils,
  IErrorUtilsType,
  IScamFilterSettingsUtils,
  IScamFilterSettingsUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities/index.js";

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
    bind<ITwitterService>(ITwitterServiceType)
      .to(TwitterService)
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
    // Utilities
    bind<IContextProvider>(IContextProviderType)
      .to(ContextProvider)
      .inSingletonScope();
    bind<IConfigProvider>(IConfigProviderType)
      .to(ConfigProvider)
      .inSingletonScope();
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
