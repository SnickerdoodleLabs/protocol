import {
  AxiosAjaxUtils,
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ITimeUtils,
  ITimeUtilsType,
  TimeUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  CryptoUtils,
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/node-utils";
import { ContainerModule, interfaces } from "inversify";

import {
  BrowserTabListener,
  CoreListener,
  ErrorListener,
  PortConnectionListener,
  RpcCallHandler,
} from "@synamint-extension-sdk/core/implementations/api";
import {
  AccountService,
  DiscordService,
  IntegrationService,
  InvitationService,
  MetricsService,
  PIIService,
  PortConnectionService,
  ScamFilterService,
  TokenPriceService,
  TwitterService,
  UserSiteInteractionService,
} from "@synamint-extension-sdk/core/implementations/business";
import {
  AccountRepository,
  InvitationRepository,
  PIIRepository,
  PortConnectionRepository,
  ScamFilterRepository,
  TokenPriceRepository,
  UserSiteInteractionRepository,
} from "@synamint-extension-sdk/core/implementations/data";
import {
  ContextProvider,
  DataPermissionsUtils,
  ErrorUtils,
  ScamFilterSettingsUtils,
  ConfigProvider,
} from "@synamint-extension-sdk/core/implementations/utilities";
import { RpcEngineFactory } from "@synamint-extension-sdk/core/implementations/utilities/factory";
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
} from "@synamint-extension-sdk/core/interfaces/api";
import {
  IAccountService,
  IAccountServiceType,
  IDiscordService,
  IDiscordServiceType,
  IIntegrationService,
  IIntegrationServiceType,
  IInvitationService,
  IInvitationServiceType,
  IMetricsService,
  IMetricsServiceType,
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
} from "@synamint-extension-sdk/core/interfaces/business";
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
} from "@synamint-extension-sdk/core/interfaces/data";
import {
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
} from "@synamint-extension-sdk/core/interfaces/utilities";
import {
  IRpcEngineFactory,
  IRpcEngineFactoryType,
} from "@synamint-extension-sdk/core/interfaces/utilities/factory";

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
    bind<IIntegrationService>(IIntegrationServiceType)
      .to(IntegrationService)
      .inSingletonScope();
    bind<IInvitationService>(IInvitationServiceType)
      .to(InvitationService)
      .inSingletonScope();
    bind<IPortConnectionService>(IPortConnectionServiceType)
      .to(PortConnectionService)
      .inSingletonScope();
    bind<IMetricsService>(IMetricsServiceType)
      .to(MetricsService)
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
