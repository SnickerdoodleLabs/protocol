import { ContainerModule, interfaces } from "inversify";

import { BlockchainListener } from "@core/implementations/api";
import {
  AccountService,
  CohortService,
  QueryService,
} from "@core/implementations/business";
import {
  InsightPlatformRepository,
  LoginRegistryRepository,
} from "@core/implementations/data";
import {
  ConfigProvider,
  ContextProvider,
  DataWalletUtils,
} from "@core/implementations/utilities";
import {
  IBlockchainListener,
  IBlockchainListenerType,
} from "@core/interfaces/api";
import {
  IAccountService,
  IAccountServiceType,
  ICohortService,
  ICohortServiceType,
  IQueryService,
  IQueryServiceType,
} from "@core/interfaces/business";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
  ILoginRegistryRepository,
  ILoginRegistryRepositoryType,
} from "@core/interfaces/data";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IDataWalletUtils,
  IDataWalletUtilsType,
} from "@core/interfaces/utilities";
import { CryptoUtils, ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/common-utils";

export const snickerdoodleCoreModule = new ContainerModule(
  (
    bind: interfaces.Bind,
    _unbind: interfaces.Unbind,
    _isBound: interfaces.IsBound,
    _rebind: interfaces.Rebind,
  ) => {
    bind<IBlockchainListener>(IBlockchainListenerType)
      .to(BlockchainListener)
      .inSingletonScope();

    bind<IAccountService>(IAccountServiceType)
      .to(AccountService)
      .inSingletonScope();
    bind<ICohortService>(ICohortServiceType)
      .to(CohortService)
      .inSingletonScope();
    bind<IQueryService>(IQueryServiceType).to(QueryService).inSingletonScope();

    bind<IInsightPlatformRepository>(IInsightPlatformRepositoryType)
      .to(InsightPlatformRepository)
      .inSingletonScope();
    bind<ILoginRegistryRepository>(ILoginRegistryRepositoryType)
      .to(LoginRegistryRepository)
      .inSingletonScope();

    bind<IConfigProvider>(IConfigProviderType)
      .to(ConfigProvider)
      .inSingletonScope();
    bind<IContextProvider>(IContextProviderType)
      .to(ContextProvider)
      .inSingletonScope();
    bind<IDataWalletUtils>(IDataWalletUtilsType)
      .to(DataWalletUtils)
      .inSingletonScope();
    bind<ICryptoUtils>(ICryptoUtilsType)
      .to(CryptoUtils)
      .inSingletonScope();
  },
);
