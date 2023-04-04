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
  DiscordPoller,
  BlockchainListener,
} from "@core/implementations/api/index.js";
import {
  AccountService,
  AdService,
  ConsentTokenUtils,
  InvitationService,
  MonitoringService,
  ProfileService,
  QueryParsingEngine,
  QueryService,
  SiftContractService,
  CampaignService,
  MarketplaceService,
  IntegrationService,
  DiscordService,
  SocialMediaService
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
  AdDataRepository,
  BrowsingDataRepository,
  LinkedAccountRepository,
  PortfolioBalanceRepository,
  TransactionHistoryRepository,
  DemographicDataRepository,
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
  CoinGeckoTokenPriceRepository,
  PermissionRepository,
  DiscordRepository,
  SocialRepository,
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
  IDiscordPoller,
  IDiscordPollerType,
} from "@core/interfaces/api/index.js";
import {
  IAccountService,
  IAccountServiceType,
  IAdService,
  IAdServiceType,
  ICampaignService,
  ICampaignServiceType,
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
  ISocialMediaService,
  ISocialConnectionServiceType,
} from "@core/interfaces/business/index.js";
import {
  IBalanceQueryEvaluator,
  IBalanceQueryEvaluatorType,
  IConsentTokenUtils,
  IConsentTokenUtilsType,
  IBlockchainTransactionQueryEvaluator,
  IBlockchainTransactionQueryEvaluatorType,
  INftQueryEvaluator,
  INftQueryEvaluatorType,
  IQueryEvaluator,
  IQueryEvaluatorType,
  IQueryParsingEngine,
  IQueryParsingEngineType,
  IQueryRepository,
  IQueryRepositoryType,
  IPermissionUtils,
  IPermissionUtilsType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IAdContentRepository,
  IAdRepositoryType,
  IConsentContractRepository,
  IConsentContractRepositoryType,
  ICrumbsRepository,
  ICrumbsRepositoryType,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
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
  IAdDataRepository,
  IAdDataRepositoryType,
  IBrowsingDataRepositoryType,
  IBrowsingDataRepository,
  ILinkedAccountRepositoryType,
  ILinkedAccountRepository,
  IPortfolioBalanceRepositoryType,
  IPortfolioBalanceRepository,
  ITransactionHistoryRepositoryType,
  ITransactionHistoryRepository,
  IDemographicDataRepositoryType,
  IDemographicDataRepository,
  IPermissionRepository,
  IPermissionRepositoryType,
  IDiscordRepository,
  IDiscordRepositoryType,
  ISocialRepository,
  ISocialRepositoryType,
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
    bind<ICampaignService>(ICampaignServiceType)
      .to(CampaignService)
      .inSingletonScope();
    bind<IMonitoringService>(IMonitoringServiceType)
      .to(MonitoringService)
      .inSingletonScope();
    bind<ISiftContractService>(ISiftContractServiceType)
      .to(SiftContractService)
      .inSingletonScope();

    bind<IDiscordService>(IDiscordServiceType)
      .to(DiscordService)
      .inSingletonScope();
    bind<ISocialMediaService>(ISocialConnectionServiceType)
      .to(SocialMediaService)
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
    bind<IDiscordRepository>(IDiscordRepositoryType)
      .to(DiscordRepository)
      .inSingletonScope();
    bind<ISocialRepository>(ISocialRepositoryType)
      .to(SocialRepository)
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
     bind<IDiscordPoller>(IDiscordPollerType)
      .to(DiscordPoller)
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
