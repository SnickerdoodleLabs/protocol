import {
  AxiosAjaxUtils,
  CryptoUtils,
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  TimeUtils,
  ITimeUtils,
  ITimeUtilsType,
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";

import { ContainerModule, interfaces } from "inversify";

import {
  AccountService,
  PIIService,
  InvitationService,
  TokenPriceService,
} from "./implementations/business";
import { AccountRepository } from "./implementations/data/AccountRepository";
import { InvitationRepository } from "./implementations/data/InvitationRepository";
import { PIIRepository } from "./implementations/data/PIIRepository";
import { TokenPriceRepository } from "./implementations/data/TokenPriceRepository";
import { ConfigProvider } from "./implementations/utils/ConfigProvider";
import {
  IAccountService,
  IAccountServiceType,
} from "./interfaces/business/IAccountService";
import {
  IInvitationService,
  IInvitationServiceType,
} from "./interfaces/business/IInvitationService";
import {
  IPIIService,
  IPIIServiceType,
} from "./interfaces/business/IPIIService";
import {
  ITokenPriceService,
  ITokenPriceServiceType,
} from "./interfaces/business/ITokenPriceService";
import {
  IAccountRepository,
  IAccountRepositoryType,
} from "./interfaces/data/IAccountRepository";
import {
  IInvitationRepository,
  IInvitationRepositoryType,
} from "./interfaces/data/IInvitationRepository";
import {
  IPIIRepository,
  IPIIRepositoryType,
} from "./interfaces/data/IPIIRepository";
import {
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
} from "./interfaces/data/ITokenPriceRepository";
import {
  IConfigProvider,
  IConfigProviderType,
} from "./interfaces/utils/IConfigProvider";

export const extensionCoreModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    // Business=
    bind<IAccountService>(IAccountServiceType)
      .to(AccountService)
      .inSingletonScope();
    bind<IInvitationService>(IInvitationServiceType)
      .to(InvitationService)
      .inSingletonScope();
    bind<IPIIService>(IPIIServiceType).to(PIIService).inSingletonScope();
    bind<ITokenPriceService>(ITokenPriceServiceType)
      .to(TokenPriceService)
      .inSingletonScope();

    // Data
    bind<IAccountRepository>(IAccountRepositoryType)
      .to(AccountRepository)
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

    // Utilities
    /*     bind<IConfigProvider>(IConfigProviderType).toConstantValue(ConfigProvider);
    bind<IDataPermissionsUtils>(IDataPermissionsUtilsType)
      .to(DataPermissionsUtils)
      .inSingletonScope();
    bind<IErrorUtils>(IErrorUtilsType).to(ErrorUtils).inSingletonScope(); */
    bind<IAxiosAjaxUtils>(IAxiosAjaxUtilsType)
      .to(AxiosAjaxUtils)
      .inSingletonScope();
    bind<ICryptoUtils>(ICryptoUtilsType).to(CryptoUtils).inSingletonScope();
    bind<ITimeUtils>(ITimeUtilsType).to(TimeUtils).inSingletonScope();
  },
);
