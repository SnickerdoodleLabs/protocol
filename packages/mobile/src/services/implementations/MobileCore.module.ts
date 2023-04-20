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
} from "./business";
import {
  IAccountService,
  IAccountServiceType,
} from "../interfaces/business/IAccountService";
import {
  IInvitationService,
  IInvitationServiceType,
} from "../interfaces/business/IInvitationService";
import {
  IPIIService,
  IPIIServiceType,
} from "../interfaces/business/IPIIService";
import {
  ITokenPriceService,
  ITokenPriceServiceType,
} from "../interfaces/business/ITokenPriceService";
import { IErrorUtils, IErrorUtilsType } from "../interfaces/utils/IErrorUtils";
import { ErrorUtils } from "./utils/ErrorUtils";
import { AccountStorageRepository } from "./data/AccountStorageRepository";
import {
  IAccountStorageRepository,
  IAccountStorageRepositoryType,
} from "../interfaces/data/IAccountStorageRepository";
import {
  IDataPermissionsRepository,
  IDataPermissionsRepositoryType,
} from "../interfaces/data/IDataPermissionsRepository";
import { DataPermissionsRepository } from "./data/DataPermissionsRepository";
import { IConfigProvider, IConfigProviderType } from "@snickerdoodlelabs/core/dist/interfaces/utilities";
import { IIndexerConfigProvider, IIndexerConfigProviderType } from "@snickerdoodlelabs/indexers";
import { ConfigProvider } from "@snickerdoodlelabs/core";

export const mobileCoreModule = new ContainerModule(
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
    bind<IPIIService>(IPIIServiceType).to(PIIService).inSingletonScope();
    bind<ITokenPriceService>(ITokenPriceServiceType)
      .to(TokenPriceService)
      .inSingletonScope();
    bind<IInvitationService>(IInvitationServiceType)
      .to(InvitationService)
      .inSingletonScope();

    bind<IAccountStorageRepository>(IAccountStorageRepositoryType).to(
      AccountStorageRepository,
    );
    bind<IDataPermissionsRepository>(IDataPermissionsRepositoryType).to(
      DataPermissionsRepository,
    );

    // Utilities
    const configProvider = new ConfigProvider();
    bind<IConfigProvider>(IConfigProviderType).toConstantValue(configProvider);
    bind<IIndexerConfigProvider>(IIndexerConfigProviderType).toConstantValue(
      configProvider,
    );
    bind<IErrorUtils>(IErrorUtilsType).to(ErrorUtils).inSingletonScope();
    bind<IAxiosAjaxUtils>(IAxiosAjaxUtilsType)
      .to(AxiosAjaxUtils)
      .inSingletonScope();
    bind<ICryptoUtils>(ICryptoUtilsType).to(CryptoUtils).inSingletonScope();
    bind<ITimeUtils>(ITimeUtilsType).to(TimeUtils).inSingletonScope();
  },
);
