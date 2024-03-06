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
  IConfigProvider,
  IConfigProviderType,
} from "@snickerdoodlelabs/core/dist/interfaces/utilities";
import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@snickerdoodlelabs/indexers";
import {
  IVolatileStorageSchemaProvider,
  IVolatileStorageSchemaProviderType,
  VolatileStorageSchemaProvider,
  IPersistenceConfigProviderType,
  IPersistenceConfigProvider,
} from "@snickerdoodlelabs/persistence";
import { ContainerModule, interfaces } from "inversify";

import {
  IPIIService,
  IPIIServiceType,
} from "../interfaces/business/IPIIService";
import {
  ITokenPriceService,
  ITokenPriceServiceType,
} from "../interfaces/business/ITokenPriceService";
import {
  IAccountStorageRepository,
  IAccountStorageRepositoryType,
} from "../interfaces/data/IAccountStorageRepository";
import {
  IDataPermissionsRepository,
  IDataPermissionsRepositoryType,
} from "../interfaces/data/IDataPermissionsRepository";
import { IErrorUtils, IErrorUtilsType } from "../interfaces/utils/IErrorUtils";

import { AccountService, PIIService, TokenPriceService } from "./business";
import { AccountStorageRepository } from "./data/AccountStorageRepository";
import { DataPermissionsRepository } from "./data/DataPermissionsRepository";
import { ErrorUtils } from "./utils/ErrorUtils";
import {
  IAccountService,
  IAccountServiceType,
} from "../interfaces/business/IAccountService";
import {
  IInvitationService,
  IInvitationServiceType,
} from "../interfaces/business/IInvitationService";
import { InvitationService } from "./business/InvitationService";
import {
  IQuestionnaireService,
  IQuestionnaireServiceType,
} from "../interfaces/business/IQuestionnaireService";
import { QuestionnaireService } from "./business/QuestionnaireService";
import {
  CryptoUtils,
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/node-utils";
import {
  IStorageService,
  IStorageServiceType,
} from "../interfaces/business/IStorageService";
import { StorageService } from "./business/StorageService";
import {
  IMetricsService,
  IMetricsServiceType,
} from "../interfaces/business/IMetricsService";
import { MetricsService } from "./business/MetricsService";

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
    bind<IInvitationService>(IInvitationServiceType)
      .to(InvitationService)
      .inSingletonScope();
    bind<IQuestionnaireService>(IQuestionnaireServiceType)
      .to(QuestionnaireService)
      .inSingletonScope();
    bind<IStorageService>(IStorageServiceType)
      .to(StorageService)
      .inSingletonScope();
    bind<IMetricsService>(IMetricsServiceType)
      .to(MetricsService)
      .inSingletonScope();
    bind<IPIIService>(IPIIServiceType).to(PIIService).inSingletonScope();
    bind<ITokenPriceService>(ITokenPriceServiceType)
      .to(TokenPriceService)
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
    bind<IPersistenceConfigProvider>(
      IPersistenceConfigProviderType,
    ).toConstantValue(configProvider);

    bind<IErrorUtils>(IErrorUtilsType).to(ErrorUtils).inSingletonScope();
    bind<IAxiosAjaxUtils>(IAxiosAjaxUtilsType)
      .to(AxiosAjaxUtils)
      .inSingletonScope();
    bind<ICryptoUtils>(ICryptoUtilsType).to(CryptoUtils).inSingletonScope();
    bind<ITimeUtils>(ITimeUtilsType).to(TimeUtils).inSingletonScope();

    bind<IVolatileStorageSchemaProvider>(IVolatileStorageSchemaProviderType)
      .to(VolatileStorageSchemaProvider)
      .inSingletonScope();
  },
);
