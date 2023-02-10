import {
  AxiosAjaxUtils,
  CryptoUtils,
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ICryptoUtils,
  ICryptoUtilsType,
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
  LogUtils,
  TimeUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  CoinGeckoTokenPriceRepository,
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@snickerdoodlelabs/indexers";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
  InsightPlatformRepository,
} from "@snickerdoodlelabs/insight-platform-api";
import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
} from "@snickerdoodlelabs/objects";
import {
  BackupManagerProvider,
  IBackupManagerProvider,
  IBackupManagerProviderType,
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@snickerdoodlelabs/persistence";
import {
  IQueryObjectFactory,
  IQueryObjectFactoryType,
  ISDQLParserFactory,
  ISDQLParserFactoryType,
  ISDQLQueryUtils,
  ISDQLQueryUtilsType,
  ISDQLQueryWrapperFactory,
  ISDQLQueryWrapperFactoryType,
  QueryObjectFactory,
  SDQLParserFactory,
  SDQLQueryUtils,
  SDQLQueryWrapperFactory,
} from "@snickerdoodlelabs/query-parser";
import { ContainerModule, interfaces } from "inversify";

import {
  AccountIndexerPoller,
  BlockchainListener,
} from "@core/implementations/api/index.js";
import {
  AccountService,
  AdService,
  BalanceQueryEvaluator,
  ConsentTokenUtils,
  InvitationService,
  MonitoringService,
  NetworkQueryEvaluator,
  ProfileService,
  QueryEvaluator,
  QueryParsingEngine,
  QueryRepository,
  QueryService,
  SiftContractService,
} from "@core/implementations/business/index.js";
import {
  AdContentRepository,
  ConsentContractRepository,
  CrumbsRepository,
  DataWalletPersistence,
  DNSRepository,
  InvitationRepository,
  MarketplaceRepository,
  MetatransactionForwarderRepository,
  SDQLQueryRepository,
  SiftContractRepository,
} from "@core/implementations/data/index.js";
import {
  ContractFactory,
  QueryFactories,
} from "@core/implementations/utilities/factory/index.js";
import {
  BlockchainProvider,
  ConfigProvider,
  ContextProvider,
  DataWalletUtils,
} from "@core/implementations/utilities/index.js";
import {
  IAccountIndexerPoller,
  IAccountIndexerPollerType,
  IBlockchainListener,
  IBlockchainListenerType,
} from "@core/interfaces/api/index.js";
import {
  IAccountService,
  IAccountServiceType,
  IAdService,
  IAdServiceType,
  IInvitationService,
  IInvitationServiceType,
  IMonitoringService,
  IMonitoringServiceType,
  IProfileService,
  IProfileServiceType,
  IQueryService,
  IQueryServiceType,
  ISiftContractService,
  ISiftContractServiceType,
} from "@core/interfaces/business/index.js";
import {
  IBalanceQueryEvaluator,
  IBalanceQueryEvaluatorType,
  IConsentTokenUtils,
  IConsentTokenUtilsType,
  INetworkQueryEvaluator,
  INetworkQueryEvaluatorType,
  IQueryEvaluator,
  IQueryEvaluatorType,
  IQueryParsingEngine,
  IQueryParsingEngineType,
  IQueryRepository,
  IQueryRepositoryType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IAdContentRepository,
  IAdRepositoryType,
  IConsentContractRepository,
  IConsentContractRepositoryType,
  ICrumbsRepository,
  ICrumbsRepositoryType,
  IDNSRepository,
  IDNSRepositoryType,
  IInvitationRepository,
  IInvitationRepositoryType,
  IMarketplaceRepository,
  IMarketplaceRepositoryType,
  IMetatransactionForwarderRepository,
  IMetatransactionForwarderRepositoryType,
  ISDQLQueryRepository,
  ISDQLQueryRepositoryType,
  ISiftContractRepository,
  ISiftContractRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IContractFactory,
  IContractFactoryType,
  IQueryFactories,
  IQueryFactoriesType,
} from "@core/interfaces/utilities/factory/index.js";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IDataWalletUtils,
  IDataWalletUtilsType,
} from "@core/interfaces/utilities/index.js";


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
    bind<IAdService>(IAdServiceType)
      .to(AdService)
      .inSingletonScope();
    bind<IQueryService>(IQueryServiceType).to(QueryService).inSingletonScope();
    bind<IMonitoringService>(IMonitoringServiceType)
      .to(MonitoringService)
      .inSingletonScope();
    bind<ISiftContractService>(ISiftContractServiceType)
      .to(SiftContractService)
      .inSingletonScope();

    bind<IConsentTokenUtils>(IConsentTokenUtilsType)
      .to(ConsentTokenUtils)
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
    bind<ISiftContractRepository>(ISiftContractRepositoryType)
      .to(SiftContractRepository)
      .inSingletonScope();
    bind<IMetatransactionForwarderRepository>(
      IMetatransactionForwarderRepositoryType,
    ).to(MetatransactionForwarderRepository);
    bind<IMarketplaceRepository>(IMarketplaceRepositoryType).to(
      MarketplaceRepository,
    );
    bind<IDNSRepository>(IDNSRepositoryType)
      .to(DNSRepository)
      .inSingletonScope();
    bind<ISDQLQueryRepository>(ISDQLQueryRepositoryType)
      .to(SDQLQueryRepository)
      .inSingletonScope();
    bind<IInvitationRepository>(IInvitationRepositoryType)
      .to(InvitationRepository)
      .inSingletonScope();

    // Data Persistence and Indexing
    bind<IDataWalletPersistence>(IDataWalletPersistenceType)
      .to(DataWalletPersistence)
      .inSingletonScope();
    bind<IBackupManagerProvider>(IBackupManagerProviderType)
      .to(BackupManagerProvider)
      .inSingletonScope();
    bind<ITokenPriceRepository>(ITokenPriceRepositoryType)
      .to(CoinGeckoTokenPriceRepository)
      .inSingletonScope();

    // Utilities
    const configProvider = new ConfigProvider();
    bind<IConfigProvider>(IConfigProviderType).toConstantValue(configProvider);
    bind<IIndexerConfigProvider>(IIndexerConfigProviderType).toConstantValue(
      configProvider,
    );
    bind<IPersistenceConfigProvider>(
      IPersistenceConfigProviderType,
    ).toConstantValue(configProvider);

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
    bind<INetworkQueryEvaluator>(INetworkQueryEvaluatorType)
      .to(NetworkQueryEvaluator)
      .inSingletonScope();

    bind<IQueryEvaluator>(IQueryEvaluatorType)
      .to(QueryEvaluator)
      .inSingletonScope();

    bind<IBalanceQueryEvaluator>(IBalanceQueryEvaluatorType)
      .to(BalanceQueryEvaluator)
      .inSingletonScope();

    bind<IQueryRepository>(IQueryRepositoryType)
      .to(QueryRepository)
      .inSingletonScope();

    bind<IAdContentRepository>(IAdRepositoryType)
      .to(AdContentRepository)
      .inSingletonScope();

    bind<ISDQLParserFactory>(ISDQLParserFactoryType)
      .to(SDQLParserFactory)
      .inSingletonScope();

    bind<ISDQLQueryUtils>(ISDQLQueryUtilsType)
      .to(SDQLQueryUtils)
      .inSingletonScope();

    bind<IQueryFactories>(IQueryFactoriesType)
      .to(QueryFactories)
      .inSingletonScope();

    bind<IQueryObjectFactory>(IQueryObjectFactoryType)
      .to(QueryObjectFactory)
      .inSingletonScope();

    bind<ISDQLQueryWrapperFactory>(ISDQLQueryWrapperFactoryType)
      .to(SDQLQueryWrapperFactory)
      .inSingletonScope();

    bind<ITimeUtils>(ITimeUtilsType).to(TimeUtils).inSingletonScope();
  },
);
