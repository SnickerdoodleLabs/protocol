import {
  AxiosAjaxUtils,
  CryptoUtils,
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ICryptoUtils,
  ICryptoUtilsType,
  ILogUtils,
  ILogUtilsType,
  LogUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  CovalentEVMTransactionRepository,
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@snickerdoodlelabs/indexers";
import {
  IEVMTransactionRepository,
  IEVMTransactionRepositoryType,
} from "@snickerdoodlelabs/objects";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@snickerdoodlelabs/persistence";
import { ContainerModule, interfaces } from "inversify";

import {
  AccountIndexerPoller,
  BlockchainListener,
} from "@core/implementations/api";
import {
  AccountService,
  InvitationService,
  MonitoringService,
  ProfileService,
  QueryEvaluator,
  QueryParsingEngine,
  QueryRepository,
  QueryService,
} from "@core/implementations/business";
import {
  ConsentContractRepository,
  CrumbsRepository,
  DNSRepository,
  InsightPlatformRepository,
  InvitationRepository,
  MetatransactionForwarderRepository,
  SDQLQueryRepository,
} from "@core/implementations/data";
import {
  BlockchainProvider,
  ConfigProvider,
  ContextProvider,
  DataWalletUtils,
} from "@core/implementations/utilities";
import {
  ContractFactory,
  QueryFactories,
} from "@core/implementations/utilities/factory";
import {
  IAccountIndexerPoller,
  IAccountIndexerPollerType,
  IBlockchainListener,
  IBlockchainListenerType,
} from "@core/interfaces/api";
import {
  IAccountService,
  IAccountServiceType,
  IInvitationService,
  IInvitationServiceType,
  IMonitoringService,
  IMonitoringServiceType,
  IProfileService,
  IProfileServiceType,
  IQueryService,
  IQueryServiceType,
} from "@core/interfaces/business";
import {
  IQueryEvaluator,
  IQueryEvaluatorType,
  IQueryParsingEngine,
  IQueryParsingEngineType,
  IQueryRepository,
  IQueryRepositoryType,
} from "@core/interfaces/business/utilities";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  ICrumbsRepository,
  ICrumbsRepositoryType,
  IDNSRepository,
  IDNSRepositoryType,
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
  IInvitationRepository,
  IInvitationRepositoryType,
  IMetatransactionForwarderRepository,
  IMetatransactionForwarderRepositoryType,
  ISDQLQueryRepository,
  ISDQLQueryRepositoryType,
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
  IQueryFactories,
  IQueryFactoriesType
} from "@core/interfaces/utilities/factory";
import { IBalanceQueryEvaluator, IBalanceQueryEvaluatorType } from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator";
import { BalanceQueryEvaluator } from "./business/utilities/query/BalanceQueryEvaluator";
import { IQueryObjectFactory, IQueryObjectFactoryType, QueryObjectFactory } from "@snickerdoodlelabs/query-parser";

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

    bind<IInvitationService>(IInvitationServiceType)
      .to(InvitationService)
      .inSingletonScope();
    bind<IProfileService>(IProfileServiceType)
      .to(ProfileService)
      .inSingletonScope();
    bind<IQueryService>(IQueryServiceType).to(QueryService).inSingletonScope();
    bind<IMonitoringService>(IMonitoringServiceType)
      .to(MonitoringService)
      .inSingletonScope();

    bind<IQueryParsingEngine>(IQueryParsingEngineType)
      .to(QueryParsingEngine)
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
    bind<IMetatransactionForwarderRepository>(
      IMetatransactionForwarderRepositoryType,
    ).to(MetatransactionForwarderRepository);
    bind<IDNSRepository>(IDNSRepositoryType)
      .to(DNSRepository)
      .inSingletonScope();
    bind<IEVMTransactionRepository>(IEVMTransactionRepositoryType)
      .to(CovalentEVMTransactionRepository)
      .inSingletonScope();
    bind<ISDQLQueryRepository>(ISDQLQueryRepositoryType)
      .to(SDQLQueryRepository)
      .inSingletonScope();
    bind<IInvitationRepository>(IInvitationRepositoryType)
      .to(InvitationRepository)
      .inSingletonScope();

    // Utilities
    bind<IConfigProvider>(IConfigProviderType)
      .to(ConfigProvider)
      .inSingletonScope();
    bind<IIndexerConfigProvider>(IIndexerConfigProviderType)
      .to(ConfigProvider)
      .inSingletonScope();
    bind<IPersistenceConfigProvider>(IPersistenceConfigProviderType)
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

    bind<IBalanceQueryEvaluator>(IBalanceQueryEvaluatorType)
      .to(BalanceQueryEvaluator)
      .inSingletonScope();

    bind<IQueryRepository>(IQueryRepositoryType)
      .to(QueryRepository)
      .inSingletonScope();

      bind<IQueryFactories>(IQueryFactoriesType)
      .to(QueryFactories)
      .inSingletonScope();

      bind<IQueryObjectFactory>(IQueryObjectFactoryType)
        .to(QueryObjectFactory)
        .inSingletonScope();
  },
);
