import {
  AxiosAjaxUtils,
  CryptoUtils,
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ICryptoUtils,
  ICryptoUtilsType,
  ILogUtils,
  ILogUtilsType,
  LogUtils
} from "@snickerdoodlelabs/common-utils";
import {
  CovalentEVMTransactionRepository,
  IIndexerConfigProvider,
  IIndexerConfigProviderType
} from "@snickerdoodlelabs/indexers";
import {
  IEVMTransactionRepository,
  IEVMTransactionRepositoryType
} from "@snickerdoodlelabs/objects";
import { ContainerModule, interfaces } from "inversify";

import {
  QueryEvaluator, QueryRepository
} from "./business/utilities/query";

import {
  AccountIndexerPoller,
  BlockchainListener
} from "@core/implementations/api";
import {
  AccountService,
  CohortService,
  MonitoringService,
  ProfileService,
  QueryService
} from "@core/implementations/business";
import {
  ConsentContractRepository, CrumbsRepository, InsightPlatformRepository
} from "@core/implementations/data";
import {
  BlockchainProvider,
  ConfigProvider,
  ContextProvider,
  DataWalletUtils
} from "@core/implementations/utilities";
import { ContractFactory, QueryFactories } from "@core/implementations/utilities/factory";
import {
  IAccountIndexerPoller,
  IAccountIndexerPollerType,
  IBlockchainListener,
  IBlockchainListenerType
} from "@core/interfaces/api";
import {
  IAccountService,
  IAccountServiceType,
  ICohortService,
  ICohortServiceType,
  IMonitoringService,
  IMonitoringServiceType,
  IProfileService,
  IProfileServiceType,
  IQueryService,
  IQueryServiceType
} from "@core/interfaces/business";
import { IQueryEvaluator, IQueryEvaluatorType, IQueryRepository, IQueryRepositoryType } from "@core/interfaces/business/utilities";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  ICrumbsRepository,
  ICrumbsRepositoryType,
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType
} from "@core/interfaces/data";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IDataWalletUtils,
  IDataWalletUtilsType
} from "@core/interfaces/utilities";
import {
  IContractFactory,
  IContractFactoryType,
  IQueryFactories,
  IQueryFactoriesType
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
    bind<IAccountIndexerPoller>(IAccountIndexerPollerType)
      .to(AccountIndexerPoller)
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
    bind<IMonitoringService>(IMonitoringServiceType)
      .to(MonitoringService)
      .inSingletonScope();

    bind<IInsightPlatformRepository>(IInsightPlatformRepositoryType)
      .to(InsightPlatformRepository)
      .inSingletonScope();
    bind<ICrumbsRepository>(ICrumbsRepositoryType)
      .to(CrumbsRepository)
      .inSingletonScope();
    bind<IConsentContractRepository>(IConsentContractRepositoryType).to(
      ConsentContractRepository,
    );
    bind<IEVMTransactionRepository>(IEVMTransactionRepositoryType)
      .to(CovalentEVMTransactionRepository)
      .inSingletonScope();

    // Utilities

    bind<IConfigProvider>(IConfigProviderType)
      .to(ConfigProvider)
      .inSingletonScope();
    bind<IIndexerConfigProvider>(IIndexerConfigProviderType)
      .to(ConfigProvider)
      .inSingletonScope();
    bind<IContextProvider>(IContextProviderType)
      .to(ContextProvider)
      .inSingletonScope();
    bind<IBlockchainProvider>(IBlockchainProviderType)
      .to(BlockchainProvider)
      .inSingletonScope();
    bind<IDataWalletUtils>(IDataWalletUtilsType)
      .to(DataWalletUtils)
      .inSingletonScope();
    bind<ILogUtils>(ILogUtilsType).to(LogUtils).inSingletonScope();
    bind<ICryptoUtils>(ICryptoUtilsType).to(CryptoUtils).inSingletonScope();
    bind<IAxiosAjaxUtils>(IAxiosAjaxUtilsType)
      .to(AxiosAjaxUtils)
      .inSingletonScope();

    // Utilites/factory
    bind<IContractFactory>(IContractFactoryType)
      .to(ContractFactory)
      .inSingletonScope();

    // Query instances
    bind<IQueryEvaluator>(IQueryEvaluatorType)
      .to(QueryEvaluator)
      .inSingletonScope();

    bind<IQueryRepository>(IQueryRepositoryType)
      .to(QueryRepository)
      .inSingletonScope();
    
    bind<IQueryFactories>(IQueryFactoriesType)
      .to(QueryFactories)
      .inSingletonScope();
  },
);
