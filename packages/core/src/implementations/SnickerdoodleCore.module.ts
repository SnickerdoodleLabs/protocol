import {
  AxiosAjaxUtils,
  CryptoUtils,
  IAjaxUtilsType,
  IAxiosAjaxUtils,
  ICryptoUtils,
  ICryptoUtilsType,
  ILogUtils,
  ILogUtilsType,
  LogUtils,
} from "@snickerdoodlelabs/common-utils";
import { ContainerModule, interfaces } from "inversify";

import { BlockchainListener } from "@core/implementations/api";
import {
  AccountService,
  CohortService,
  ProfileService,
  QueryService,
} from "@core/implementations/business";
import {
  InsightPlatformRepository,
  LoginRegistryRepository,
} from "@core/implementations/data";
import {
  BlockchainProvider,
  ConfigProvider,
  ContextProvider,
  DataWalletUtils,
} from "@core/implementations/utilities";
import { ContractFactory } from "@core/implementations/utilities/factory";
import {
  IBlockchainListener,
  IBlockchainListenerType,
} from "@core/interfaces/api";
import {
  IAccountService,
  IAccountServiceType,
  ICohortService,
  ICohortServiceType,
  IProfileService,
  IProfileServiceType,
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
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IDataWalletUtils,
  IDataWalletUtilsType,
} from "@core/interfaces/utilities";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory";

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
    bind<IProfileService>(IProfileServiceType)
      .to(ProfileService)
      .inSingletonScope();
    bind<IQueryService>(IQueryServiceType).to(QueryService).inSingletonScope();

    bind<IInsightPlatformRepository>(IInsightPlatformRepositoryType)
      .to(InsightPlatformRepository)
      .inSingletonScope();
    bind<ILoginRegistryRepository>(ILoginRegistryRepositoryType)
      .to(LoginRegistryRepository)
      .inSingletonScope();

    // Utilities
    bind<IBlockchainProvider>(IBlockchainProviderType)
      .to(BlockchainProvider)
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
    bind<ICryptoUtils>(ICryptoUtilsType).to(CryptoUtils).inSingletonScope();
    bind<ILogUtils>(ILogUtilsType).to(LogUtils).inSingletonScope();
    bind<IAxiosAjaxUtils>(IAjaxUtilsType).to(AxiosAjaxUtils).inSingletonScope();

    // Utilites/factor
    bind<IContractFactory>(IContractFactoryType)
      .to(ContractFactory)
      .inSingletonScope();
  },
);
