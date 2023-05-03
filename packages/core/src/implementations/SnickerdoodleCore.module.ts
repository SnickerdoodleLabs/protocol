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
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@snickerdoodlelabs/indexers";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
  InsightPlatformRepository,
} from "@snickerdoodlelabs/insight-platform-api";
import {
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
} from "@snickerdoodlelabs/objects";
import {
  BackupManagerProvider,
  BackupUtils,
  ChunkRendererFactory,
  FieldSchemaProvider,
  IBackupManagerProvider,
  IBackupManagerProviderType,
  IBackupUtils,
  IBackupUtilsType,
  IChunkRendererFactory,
  IChunkRendererFactoryType,
  IFieldSchemaProvider,
  IFieldSchemaProviderType,
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
  IVolatileStorageSchemaProvider,
  IVolatileStorageSchemaProviderType,
  VolatileStorageSchemaProvider,
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
  HeartbeatGenerator,
  SocialMediaPoller,
} from "@core/implementations/api/index.js";
import {
  AccountService,
  AdService,
  ConsentTokenUtils,
  DiscordService,
  IntegrationService,
  InvitationService,
  MarketplaceService,
  MonitoringService,
  ProfileService,
  QueryParsingEngine,
  QueryService,
  SiftContractService,
  TwitterService,
} from "@core/implementations/business/index.js";
import { PermissionUtils } from "@core/implementations/business/utilities/index.js";
import {
  BalanceQueryEvaluator,
  BlockchainTransactionQueryEvaluator,
  NftQueryEvaluator,
  QueryEvaluator,
  QueryRepository,
} from "@core/implementations/business/utilities/query/index.js";
import {
  AdContentRepository,
  AdDataRepository,
  BrowsingDataRepository,
  CoinGeckoTokenPriceRepository,
  ConsentContractRepository,
  CrumbsRepository,
  DNSRepository,
  DataWalletPersistence,
  DemographicDataRepository,
  DiscordRepository,
  DomainCredentialRepository,
  InvitationRepository,
  LinkedAccountRepository,
  MarketplaceRepository,
  MetatransactionForwarderRepository,
  OAuthRepository,
  PermissionRepository,
  PortfolioBalanceRepository,
  SDQLQueryRepository,
  SiftContractRepository,
  SocialRepository,
  TransactionHistoryRepository,
  TwitterRepository,
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
  IHeartbeatGenerator,
  IHeartbeatGeneratorType,
  ISocialMediaPoller,
  ISocialMediaPollerType,
} from "@core/interfaces/api/index.js";
import {
  IAccountService,
  IAccountServiceType,
  IAdService,
  IAdServiceType,
  IDiscordService,
  IDiscordServiceType,
  IIntegrationService,
  IIntegrationServiceType,
  IInvitationService,
  IInvitationServiceType,
  IMarketplaceService,
  IMarketplaceServiceType,
  IMonitoringService,
  IMonitoringServiceType,
  IProfileService,
  IProfileServiceType,
  IQueryService,
  IQueryServiceType,
  ISiftContractService,
  ISiftContractServiceType,
  ITwitterService,
  ITwitterServiceType,
} from "@core/interfaces/business/index.js";
import {
  IBalanceQueryEvaluator,
  IBalanceQueryEvaluatorType,
  IBlockchainTransactionQueryEvaluator,
  IBlockchainTransactionQueryEvaluatorType,
  IConsentTokenUtils,
  IConsentTokenUtilsType,
  INftQueryEvaluator,
  INftQueryEvaluatorType,
  IPermissionUtils,
  IPermissionUtilsType,
  IQueryEvaluator,
  IQueryEvaluatorType,
  IQueryParsingEngine,
  IQueryParsingEngineType,
  IQueryRepository,
  IQueryRepositoryType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IAdContentRepository,
  IAdDataRepository,
  IAdDataRepositoryType,
  IAdRepositoryType,
  IBrowsingDataRepository,
  IBrowsingDataRepositoryType,
  IConsentContractRepository,
  IConsentContractRepositoryType,
  ICrumbsRepository,
  ICrumbsRepositoryType,
  IDNSRepository,
  IDNSRepositoryType,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IDemographicDataRepository,
  IDemographicDataRepositoryType,
  IDiscordRepository,
  IDiscordRepositoryType,
  IDomainCredentialRepository,
  IDomainCredentialRepositoryType,
  IInvitationRepository,
  IInvitationRepositoryType,
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
  IMarketplaceRepository,
  IMarketplaceRepositoryType,
  IMetatransactionForwarderRepository,
  IMetatransactionForwarderRepositoryType,
  IOAuthRepository,
  IOAuthRepositoryType,
  IPermissionRepository,
  IPermissionRepositoryType,
  IPortfolioBalanceRepository,
  IPortfolioBalanceRepositoryType,
  ISDQLQueryRepository,
  ISDQLQueryRepositoryType,
  ISiftContractRepository,
  ISiftContractRepositoryType,
  ISocialRepository,
  ISocialRepositoryType,
  ITransactionHistoryRepository,
  ITransactionHistoryRepositoryType,
  ITwitterRepository,
  ITwitterRepositoryType,
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
    bind<ISocialMediaPoller>(ISocialMediaPollerType)
      .to(SocialMediaPoller)
      .inSingletonScope();
    bind<IBlockchainListener>(IBlockchainListenerType)
      .to(BlockchainListener)
      .inSingletonScope();
    bind<IAccountIndexerPoller>(IAccountIndexerPollerType)
      .to(AccountIndexerPoller)
      .inSingletonScope();
    bind<IHeartbeatGenerator>(IHeartbeatGeneratorType)
      .to(HeartbeatGenerator)
      .inSingletonScope();

    bind<IAccountService>(IAccountServiceType)
      .to(AccountService)
      .inSingletonScope();

    bind<IIntegrationService>(IIntegrationServiceType)
      .to(IntegrationService)
      .inSingletonScope();
    bind<IInvitationService>(IInvitationServiceType)
      .to(InvitationService)
      .inSingletonScope();
    bind<IMarketplaceService>(IMarketplaceServiceType)
      .to(MarketplaceService)
      .inSingletonScope();
    bind<IProfileService>(IProfileServiceType)
      .to(ProfileService)
      .inSingletonScope();
    bind<IAdService>(IAdServiceType).to(AdService).inSingletonScope();
    bind<IQueryService>(IQueryServiceType).to(QueryService).inSingletonScope();
    bind<IMonitoringService>(IMonitoringServiceType)
      .to(MonitoringService)
      .inSingletonScope();
    bind<ISiftContractService>(ISiftContractServiceType)
      .to(SiftContractService)
      .inSingletonScope();

    bind<IDiscordService>(IDiscordServiceType)
      .to(DiscordService)
      .inSingletonScope();
    bind<ITwitterService>(ITwitterServiceType)
      .to(TwitterService)
      .inSingletonScope();

    bind<IConsentTokenUtils>(IConsentTokenUtilsType)
      .to(ConsentTokenUtils)
      .inSingletonScope();
    bind<IPermissionUtils>(IPermissionUtilsType)
      .to(PermissionUtils)
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
    bind<IDomainCredentialRepository>(IDomainCredentialRepositoryType)
      .to(DomainCredentialRepository)
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
    bind<IChunkRendererFactory>(IChunkRendererFactoryType)
      .to(ChunkRendererFactory)
      .inSingletonScope();
    bind<ITokenPriceRepository>(ITokenPriceRepositoryType)
      .to(CoinGeckoTokenPriceRepository)
      .inSingletonScope();
    bind<IAdDataRepository>(IAdDataRepositoryType)
      .to(AdDataRepository)
      .inSingletonScope();
    bind<IBrowsingDataRepository>(IBrowsingDataRepositoryType)
      .to(BrowsingDataRepository)
      .inSingletonScope();
    bind<ILinkedAccountRepository>(ILinkedAccountRepositoryType)
      .to(LinkedAccountRepository)
      .inSingletonScope();
    bind<IPortfolioBalanceRepository>(IPortfolioBalanceRepositoryType)
      .to(PortfolioBalanceRepository)
      .inSingletonScope();
    bind<ITransactionHistoryRepository>(ITransactionHistoryRepositoryType)
      .to(TransactionHistoryRepository)
      .inSingletonScope();
    bind<IDemographicDataRepository>(IDemographicDataRepositoryType)
      .to(DemographicDataRepository)
      .inSingletonScope();
    bind<IPermissionRepository>(IPermissionRepositoryType)
      .to(PermissionRepository)
      .inSingletonScope();
    bind<IOAuthRepository>(IOAuthRepositoryType)
      .to(OAuthRepository)
      .inSingletonScope();
    bind<IDiscordRepository>(IDiscordRepositoryType)
      .to(DiscordRepository)
      .inSingletonScope();
    bind<ITwitterRepository>(ITwitterRepositoryType)
      .to(TwitterRepository)
      .inSingletonScope();
    bind<ISocialRepository>(ISocialRepositoryType).to(SocialRepository);

    bind<IBackupUtils>(IBackupUtilsType).to(BackupUtils).inSingletonScope();
    bind<IVolatileStorageSchemaProvider>(IVolatileStorageSchemaProviderType)
      .to(VolatileStorageSchemaProvider)
      .inSingletonScope();
    bind<IFieldSchemaProvider>(IFieldSchemaProviderType)
      .to(FieldSchemaProvider)
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
    bind<IBlockchainTransactionQueryEvaluator>(
      IBlockchainTransactionQueryEvaluatorType,
    )
      .to(BlockchainTransactionQueryEvaluator)
      .inSingletonScope();

    bind<INftQueryEvaluator>(INftQueryEvaluatorType)
      .to(NftQueryEvaluator)
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
