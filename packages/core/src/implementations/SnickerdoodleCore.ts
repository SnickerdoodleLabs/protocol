/**
 * This is the main implementation of the Snickerdoodle Protocol.
 *
 * Regardless of form factor, you need to instantiate an instance
 * of SnickerdoodleCore.
 */
import {
  IMasterIndexer,
  IMasterIndexerType,
  indexersModule,
} from "@snickerdoodlelabs/indexers";
import {
  AccountAddress,
  AccountIndexingError,
  AdKey,
  AdSignature,
  AdSurfaceId,
  Age,
  AjaxError,
  BackupFileName,
  BlockchainProviderError,
  ChainId,
  ChainTransaction,
  ConsentContractError,
  ConsentError,
  CountryCode,
  DataPermissions,
  DataWalletBackup,
  DataWalletBackupID,
  DiscordID,
  DomainName,
  EarnedReward,
  EChain,
  EDataWalletPermission,
  EligibleAd,
  EmailAddressString,
  EScamFilterStatus,
  EvaluationError,
  EVMContractAddress,
  FamilyName,
  Gender,
  GivenName,
  IAdMethods,
  IConfigOverrides,
  IConsentCapacity,
  ICoreDiscordMethods,
  ICoreIntegrationMethods,
  ICoreMarketplaceMethods,
  ICoreTwitterMethods,
  IDynamicRewardParameter,
  IInvitationMethods,
  IMetricsMethods,
  Invitation,
  IpfsCID,
  IPFSError,
  ISnickerdoodleCore,
  ISnickerdoodleCoreEvents,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
  LanguageCode,
  LinkedAccount,
  MarketplaceListing,
  MarketplaceTag,
  OAuth1RequstToken,
  OAuthAuthorizationCode,
  OAuthVerifier,
  PagingRequest,
  PersistenceError,
  QueryFormatError,
  SDQLQuery,
  SHA256Hash,
  SiftContractError,
  Signature,
  SiteVisit,
  TokenAddress,
  TokenBalance,
  TokenInfo,
  TokenMarketData,
  TransactionFilter,
  TransactionPaymentCounter,
  TwitterID,
  UnauthorizedError,
  UninitializedError,
  UnixTimestamp,
  URLString,
  WalletNFT,
  IAccountMethods,
  QueryStatus,
  BlockchainCommonErrors,
  ECloudStorageType,
  AccessToken,
  AuthenticatedStorageSettings,
  IStorageMethods,
  BlockNumber,
  RefreshToken,
} from "@snickerdoodlelabs/objects";
import {
  IndexedDBVolatileStorage,
  IVolatileStorage,
  IVolatileStorageType,
  ICloudStorageManager,
  ICloudStorageManagerType,
} from "@snickerdoodlelabs/persistence";
import {
  IStorageUtils,
  IStorageUtilsType,
  LocalStorageUtils,
} from "@snickerdoodlelabs/utils";
import { Container } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { snickerdoodleCoreModule } from "@core/implementations/SnickerdoodleCore.module.js";
import {
  IAccountIndexerPoller,
  IAccountIndexerPollerType,
  IBlockchainListener,
  IBlockchainListenerType,
  ISocialMediaPoller,
  ISocialMediaPollerType,
  IHeartbeatGenerator,
  IHeartbeatGeneratorType,
} from "@core/interfaces/api/index.js";
import {
  IAccountService,
  IAccountServiceType,
  IAdService,
  IAdServiceType,
  ICloudStorageService,
  ICloudStorageServiceType,
  IDiscordService,
  IDiscordServiceType,
  IIntegrationService,
  IIntegrationServiceType,
  IInvitationService,
  IInvitationServiceType,
  IMarketplaceService,
  IMarketplaceServiceType,
  IMetricsService,
  IMetricsServiceType,
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
  IAdDataRepository,
  IAdDataRepositoryType,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/index.js";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

export class SnickerdoodleCore implements ISnickerdoodleCore {
  protected iocContainer: Container;

  public account: IAccountMethods;
  public invitation: IInvitationMethods;
  public marketplace: ICoreMarketplaceMethods;
  public integration: ICoreIntegrationMethods;
  public discord: ICoreDiscordMethods;
  public twitter: ICoreTwitterMethods;
  public ads: IAdMethods;
  public metrics: IMetricsMethods;
  public storage: IStorageMethods;

  public scraper: IScraperMethods;

  public constructor(
    configOverrides?: IConfigOverrides,
    storageUtils?: IStorageUtils,
    volatileStorage?: IVolatileStorage,
  ) {
    this.iocContainer = new Container();

    // Elaborate syntax to demonstrate that we can use multiple modules
    this.iocContainer.load(...[snickerdoodleCoreModule, indexersModule]);

    // If persistence is provided, we need to hook it up. If it is not, we will use the default
    // persistence.

    if (storageUtils != null) {
      this.iocContainer.bind(IStorageUtilsType).toConstantValue(storageUtils);
    } else {
      this.iocContainer
        .bind(IStorageUtilsType)
        .to(LocalStorageUtils)
        .inSingletonScope();
    }

    if (volatileStorage != null) {
      this.iocContainer
        .bind(IVolatileStorageType)
        .toConstantValue(volatileStorage);
    } else {
      this.iocContainer
        .bind(IVolatileStorageType)
        .to(IndexedDBVolatileStorage)
        .inSingletonScope();
    }

    // Setup the config
    if (configOverrides != null) {
      const configProvider =
        this.iocContainer.get<IConfigProvider>(IConfigProviderType);

      configProvider.setConfigOverrides(configOverrides);
    }

    // Account Methods -------------------------------------------------------------------------------
    this.account = {
      getLinkAccountMessage: (
        languageCode: LanguageCode,
        sourceDomain: DomainName | undefined = undefined,
      ) => {
        const accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);

        return accountService.getLinkAccountMessage(languageCode);
      },

      addAccount: (
        accountAddress: AccountAddress,
        signature: Signature,
        languageCode: LanguageCode,
        chain: EChain,
        sourceDomain: DomainName | undefined = undefined,
      ) => {
        const accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);

        return accountService.addAccount(
          accountAddress,
          signature,
          languageCode,
          chain,
        );
      },

      unlinkAccount: (
        accountAddress: AccountAddress,
        chain: EChain,
        sourceDomain: DomainName | undefined = undefined,
      ) => {
        const accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);

        return accountService.unlinkAccount(accountAddress, chain);
      },
    };

    // Invitation Methods ----------------------------------------------------------------------------
    this.invitation = {
      checkInvitationStatus: (
        invitation: Invitation,
        sourceDomain: DomainName | undefined = undefined,
      ) => {
        const invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );

        return invitationService.checkInvitationStatus(invitation);
      },
      acceptInvitation: (
        invitation: Invitation,
        dataPermissions: DataPermissions | null,
        sourceDomain: DomainName | undefined = undefined,
      ) => {
        const invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );

        return invitationService.acceptInvitation(invitation, dataPermissions);
      },
      rejectInvitation: (
        invitation: Invitation,
        rejectUntil: UnixTimestamp | undefined = undefined,
        sourceDomain: DomainName | undefined = undefined,
      ) => {
        const invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );

        return invitationService.rejectInvitation(invitation, rejectUntil);
      },
      leaveCohort: (
        consentContractAddress: EVMContractAddress,
        sourceDomain: DomainName | undefined = undefined,
      ) => {
        const invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );

        return invitationService.leaveCohort(consentContractAddress);
      },
      getAcceptedInvitations: (
        sourceDomain: DomainName | undefined = undefined,
      ) => {
        const invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );

        return invitationService.getAcceptedInvitations();
      },
      getInvitationsByDomain: (
        domain: DomainName,
        sourceDomain: DomainName | undefined = undefined,
      ) => {
        const invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );

        return invitationService.getInvitationsByDomain(domain);
      },
      getAgreementFlags: (
        consentContractAddress: EVMContractAddress,
        sourceDomain: DomainName | undefined = undefined,
      ) => {
        const invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );

        return invitationService.getAgreementFlags(consentContractAddress);
      },
      getAvailableInvitationsCID: (
        sourceDomain: DomainName | undefined = undefined,
      ) => {
        const invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );

        return invitationService.getAvailableInvitationsCID();
      },
      getAcceptedInvitationsCID: (
        sourceDomain: DomainName | undefined = undefined,
      ) => {
        const invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );

        return invitationService.getAcceptedInvitationsCID();
      },
      getInvitationMetadataByCID: (ipfsCID: IpfsCID) => {
        const invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );

        return invitationService.getInvitationMetadataByCID(ipfsCID);
      },
      updateDataPermissions: (
        consentContractAddress: EVMContractAddress,
        dataPermissions: DataPermissions,
        sourceDomain: DomainName | undefined = undefined,
      ) => {
        const invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );

        return invitationService.updateDataPermissions(
          consentContractAddress,
          dataPermissions,
        );
      },
    };

    // Integration Methods ---------------------------------------------------------------------------
    this.integration = {
      grantPermissions: (
        permissions: EDataWalletPermission[],
        domain: DomainName,
      ) => {
        const integrationService = this.iocContainer.get<IIntegrationService>(
          IIntegrationServiceType,
        );
        return integrationService.grantPermissions(permissions, domain);
      },
      revokePermissions: (domain: DomainName) => {
        const integrationService = this.iocContainer.get<IIntegrationService>(
          IIntegrationServiceType,
        );
        return integrationService.revokePermissions(domain);
      },
      requestPermissions: (
        permissions: EDataWalletPermission[],
        sourceDomain: DomainName,
      ) => {
        const integrationService = this.iocContainer.get<IIntegrationService>(
          IIntegrationServiceType,
        );
        return integrationService.requestPermissions(permissions, sourceDomain);
      },
      getPermissions: (
        domain: DomainName,
        sourceDomain: DomainName | undefined = undefined,
      ) => {
        const integrationService = this.iocContainer.get<IIntegrationService>(
          IIntegrationServiceType,
        );
        return integrationService.getPermissions(domain, sourceDomain);
      },
      getTokenVerificationPublicKey: (domain: DomainName) => {
        const integrationService = this.iocContainer.get<IIntegrationService>(
          IIntegrationServiceType,
        );
        return integrationService.getTokenVerificationPublicKey(domain);
      },
      getBearerToken: (nonce: string, domain: DomainName) => {
        const integrationService = this.iocContainer.get<IIntegrationService>(
          IIntegrationServiceType,
        );
        return integrationService.getBearerToken(nonce, domain);
      },
    };

    // Marketplace Methods ---------------------------------------------------------------------------
    this.marketplace = {
      getMarketplaceListingsByTag: (
        pagingReq: PagingRequest,
        tag: MarketplaceTag,
        filterActive?: boolean,
      ) => {
        const marketplaceService = this.iocContainer.get<IMarketplaceService>(
          IMarketplaceServiceType,
        );
        return marketplaceService.getMarketplaceListingsByTag(
          pagingReq,
          tag,
          filterActive,
        );
      },
      getListingsTotalByTag: (tag: MarketplaceTag) => {
        const marketplaceService = this.iocContainer.get<IMarketplaceService>(
          IMarketplaceServiceType,
        );
        return marketplaceService.getListingsTotalByTag(tag);
      },

      getRecommendationsByListing: (listing: MarketplaceListing) => {
        const marketplaceService = this.iocContainer.get<IMarketplaceService>(
          IMarketplaceServiceType,
        );
        return marketplaceService.getRecommendationsByListing(listing);
      },

      getPossibleRewards: (
        contractAddresses: EVMContractAddress[],
        timeoutMs?: number,
      ) => {
        const marketplaceService = this.iocContainer.get<IMarketplaceService>(
          IMarketplaceServiceType,
        );
        return marketplaceService.getPossibleRewards(
          contractAddresses,
          timeoutMs ?? 3000,
        );
      },
    };

    // Metrics Methods ---------------------------------------------------------------
    this.metrics = {
      getMetrics: () => {
        const metricsService =
          this.iocContainer.get<IMetricsService>(IMetricsServiceType);

        return metricsService.getMetrics();
      },
    };

    // Social Media Methods ----------------------------------------------------------
    this.twitter = {
      getOAuth1aRequestToken: () => {
        return this.iocContainer
          .get<ITwitterService>(ITwitterServiceType)
          .getOAuth1aRequestToken();
      },
      initTwitterProfile: (
        requestToken: OAuth1RequstToken,
        oAuthVerifier: OAuthVerifier,
      ) => {
        return this.iocContainer
          .get<ITwitterService>(ITwitterServiceType)
          .initTwitterProfile(requestToken, oAuthVerifier);
      },
      unlinkProfile: (id: TwitterID) => {
        return this.iocContainer
          .get<ITwitterService>(ITwitterServiceType)
          .unlinkProfile(id);
      },
      getUserProfiles: () => {
        return this.iocContainer
          .get<ITwitterService>(ITwitterServiceType)
          .getUserProfiles();
      },
    };
    this.discord = {
      initializeUserWithAuthorizationCode: (code: OAuthAuthorizationCode) => {
        const discordService =
          this.iocContainer.get<IDiscordService>(IDiscordServiceType);
        return discordService.initializeUserWithAuthorizationCode(code);
      },

      installationUrl: (redirectTabId?: number) => {
        const discordService =
          this.iocContainer.get<IDiscordService>(IDiscordServiceType);
        return discordService.installationUrl(redirectTabId);
      },

      getUserProfiles: () => {
        const discordService =
          this.iocContainer.get<IDiscordService>(IDiscordServiceType);
        return discordService.getUserProfiles();
      },

      getGuildProfiles: () => {
        const discordService =
          this.iocContainer.get<IDiscordService>(IDiscordServiceType);
        return discordService.getGuildProfiles();
      },
      unlink: (discordProfileId: DiscordID) => {
        const discordService =
          this.iocContainer.get<IDiscordService>(IDiscordServiceType);
        return discordService.unlink(discordProfileId);
      },
    };
    // Ads Methods ---------------------------------------------------------------------------
    this.ads = {
      getAd: (adSurfaceId: AdSurfaceId) => {
        throw new Error("Unimplemented");
      },
      reportAdShown: (
        queryCID: IpfsCID,
        consentContractAddress: EVMContractAddress,
        key: AdKey,
        adSurfaceId: AdSurfaceId,
        contentHash: SHA256Hash,
      ) => {
        throw new Error("Unimplemented");
      },
      completeShowingAds: (queryCID: IpfsCID) => {
        throw new Error("Unimplemented");
      },
    };

    // Storage Methods ---------------------------------------------------------------------------
    this.storage = {
      getCurrentCloudStorage: (sourceDomain: DomainName | undefined) => {
        const cloudStorageManager = this.iocContainer.get<ICloudStorageManager>(
          ICloudStorageManagerType,
        );

        return cloudStorageManager.getCurrentCloudStorage();
      },
      getAvailableCloudStorageOptions: (
        sourceDomain: DomainName | undefined,
      ) => {
        const cloudStorageManager = this.iocContainer.get<ICloudStorageManager>(
          ICloudStorageManagerType,
        );

        return cloudStorageManager.getAvailableCloudStorageOptions();
      },
      getDropboxAuth: (sourceDomain: DomainName | undefined) => {
        const cloudStorageManager = this.iocContainer.get<ICloudStorageManager>(
          ICloudStorageManagerType,
        );

        return cloudStorageManager.getDropboxAuth();
      },
      authenticateDropbox: (
        code: string,
        sourceDomain: DomainName | undefined,
      ) => {
        const cloudStorageService = this.iocContainer.get<ICloudStorageService>(
          ICloudStorageServiceType,
        );

        return cloudStorageService.authenticateDropbox(
          OAuthAuthorizationCode(code),
        );
      },
      setAuthenticatedStorage: (
        type: ECloudStorageType,
        path: string,
        refreshToken: RefreshToken,
        sourceDomain: DomainName | undefined,
      ) => {
        const cloudStorageService = this.iocContainer.get<ICloudStorageService>(
          ICloudStorageServiceType,
        );

        return cloudStorageService.setAuthenticatedStorage(
          new AuthenticatedStorageSettings(type, path, refreshToken),
        );
      },
    };
  }

  /**
   * Very important method, as it serves two purposes- it initializes the core and effectively logs the user in.
   * The core doesn't do any query processing until it has been initialized.
   * @param accountAddress
   * @param signature
   * @param languageCode
   * @returns
   */
  public initialize(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    void,
    PersistenceError | UninitializedError | BlockchainProviderError | AjaxError
  > {
    const blockchainProvider = this.iocContainer.get<IBlockchainProvider>(
      IBlockchainProviderType,
    );

    const accountIndexerPoller = this.iocContainer.get<IAccountIndexerPoller>(
      IAccountIndexerPollerType,
    );

    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);

    const queryService =
      this.iocContainer.get<IQueryService>(IQueryServiceType);
    const cloudStorageService = this.iocContainer.get<ICloudStorageService>(
      ICloudStorageServiceType,
    );

    const metricsService =
      this.iocContainer.get<IMetricsService>(IMetricsServiceType);

    const blockchainListener = this.iocContainer.get<IBlockchainListener>(
      IBlockchainListenerType,
    );

    const socialPoller = this.iocContainer.get<ISocialMediaPoller>(
      ISocialMediaPollerType,
    );

    const heartbeatGenerator = this.iocContainer.get<IHeartbeatGenerator>(
      IHeartbeatGeneratorType,
    );

    const indexers = this.iocContainer.get<IMasterIndexer>(IMasterIndexerType);

    // All of these initialize() methods do the same things, mostly just setup
    // subscriptions to events or setting up timers.
    // Only AccountService.initialize() should actually do anything
    // These are broken up into layers mainly for visual organization.
    return ResultUtils.combine([
      blockchainProvider.initialize(),
      indexers.initialize(),
    ])
      .andThen(() => {
        // Service Layer
        return ResultUtils.combine([
          queryService.initialize(),
          metricsService.initialize(),
          cloudStorageService.initialize(),
        ]);
      })
      .andThen(() => {
        // API Layer
        return ResultUtils.combine([
          accountIndexerPoller.initialize(),
          blockchainListener.initialize(),
          socialPoller.initialize(),
          heartbeatGenerator.initialize(),
        ]);
      })
      .andThen(() => {
        // Now the actual initialization!
        return accountService.initialize();
      })
      .map(() => {});
  }

  public getConsentCapacity(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    IConsentCapacity,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    const invitationService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return invitationService.getConsentCapacity(consentContractAddress);
  }

  public getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | BlockchainCommonErrors
  > {
    const cohortService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );
    return cohortService.getConsentContractCID(consentAddress);
  }

  public getEvents(): ResultAsync<ISnickerdoodleCoreEvents, never> {
    const contextProvider =
      this.iocContainer.get<IContextProvider>(IContextProviderType);

    return contextProvider.getContext().map((context) => {
      return context.publicEvents;
    });
  }

  public approveQuery(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    parameters: IDynamicRewardParameter[],
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    void,
    | AjaxError
    | UninitializedError
    | ConsentError
    | IPFSError
    | QueryFormatError
    | EvaluationError
    | PersistenceError
  > {
    const queryService =
      this.iocContainer.get<IQueryService>(IQueryServiceType);

    return queryService.approveQuery(consentContractAddress, query, parameters);
  }

  public getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, PersistenceError> {
    const queryService =
      this.iocContainer.get<IQueryService>(IQueryServiceType);

    return queryService.getQueryStatusByQueryCID(queryCID);
  }

  public getQueryStatuses(
    contractAddress: EVMContractAddress,
    blockNumber?: BlockNumber,
  ): ResultAsync<
    QueryStatus[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
    | PersistenceError
  > {
    const queryService =
      this.iocContainer.get<IQueryService>(IQueryServiceType);

    return queryService.getQueryStatuses(contractAddress, blockNumber);
  }

  public isDataWalletAddressInitialized(): ResultAsync<boolean, never> {
    const contextProvider =
      this.iocContainer.get<IContextProvider>(IContextProviderType);

    return contextProvider.getContext().map((context) => {
      return !!context.dataWalletAddress;
    });
  }

  public checkURL(
    domain: DomainName,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    EScamFilterStatus,
    | BlockchainProviderError
    | UninitializedError
    | SiftContractError
    | BlockchainCommonErrors
  > {
    const siftService = this.iocContainer.get<ISiftContractService>(
      ISiftContractServiceType,
    );
    return siftService.checkURL(domain);
  }

  public setGivenName(
    name: GivenName,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.setGivenName(name);
  }
  public getGivenName(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<GivenName | null, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.getGivenName();
  }
  public setFamilyName(
    name: FamilyName,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.setFamilyName(name);
  }
  public getFamilyName(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<FamilyName | null, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.getFamilyName();
  }
  public setBirthday(
    birthday: UnixTimestamp,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.setBirthday(birthday);
  }
  public getBirthday(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<UnixTimestamp | null, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.getBirthday();
  }
  public setGender(
    gender: Gender,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.setGender(gender);
  }
  public getGender(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<Gender | null, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.getGender();
  }
  public setEmail(
    email: EmailAddressString,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.setEmail(email);
  }
  public getEmail(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<EmailAddressString | null, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.getEmail();
  }
  public setLocation(
    location: CountryCode,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.setLocation(location);
  }
  public getLocation(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<CountryCode | null, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.getLocation();
  }
  getAge(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<Age | null, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.getAge();
  }

  public getAccounts(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<LinkedAccount[], UnauthorizedError | PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getAccounts(sourceDomain);
  }

  public getTransactions(
    filter?: TransactionFilter,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<ChainTransaction[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getTranactions(filter);
  }

  public getAccountBalances(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<TokenBalance[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getAccountBalances();
  }

  public getAccountNFTs(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<WalletNFT[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getAccountNFTs();
  }

  public getTransactionValueByChain(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<TransactionPaymentCounter[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getTransactionValueByChain();
  }

  public getSiteVisitsMap(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<Map<URLString, number>, PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getSiteVisitsMap();
  }
  public getSiteVisits(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<SiteVisit[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getSiteVisits();
  }
  public addSiteVisits(
    siteVisits: SiteVisit[],
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.addSiteVisits(siteVisits);
  }

  public setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, PersistenceError> {
    const invitationService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return invitationService.setDefaultReceivingAddress(receivingAddress);
  }

  public setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, PersistenceError> {
    const invitationService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return invitationService.setReceivingAddress(
      contractAddress,
      receivingAddress,
    );
  }

  public getReceivingAddress(
    contractAddress?: EVMContractAddress,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<AccountAddress, PersistenceError> {
    const invitationService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return invitationService.getReceivingAddress(contractAddress);
  }

  public getEarnedRewards(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<EarnedReward[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getEarnedRewards();
  }
  public addEarnedRewards(
    rewards: EarnedReward[],
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.addEarnedRewards(rewards);
  }

  public getEligibleAds(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<EligibleAd[], PersistenceError> {
    const adDataRepo = this.iocContainer.get<IAdDataRepository>(
      IAdDataRepositoryType,
    );
    return adDataRepo.getEligibleAds();
  }

  public getAdSignatures(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<AdSignature[], PersistenceError> {
    const adDataRepo = this.iocContainer.get<IAdDataRepository>(
      IAdDataRepositoryType,
    );
    return adDataRepo.getAdSignatures();
  }

  public onAdDisplayed(
    eligibleAd: EligibleAd,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, UninitializedError | IPFSError | PersistenceError> {
    const adService = this.iocContainer.get<IAdService>(IAdServiceType);
    return adService.onAdDisplayed(eligibleAd);
  }

  public addTransactions(
    transactions: ChainTransaction[],
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.addTransactions(transactions);
  }

  public restoreBackup(
    backup: DataWalletBackup,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, PersistenceError> {
    const persistence = this.iocContainer.get<IDataWalletPersistence>(
      IDataWalletPersistenceType,
    );
    return persistence.restoreBackup(backup);
  }

  public fetchBackup(
    backupHeader: string,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    const persistence = this.iocContainer.get<IDataWalletPersistence>(
      IDataWalletPersistenceType,
    );
    return persistence.fetchBackup(backupHeader);
  }

  public postBackups(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<DataWalletBackupID[], PersistenceError> {
    const persistence = this.iocContainer.get<IDataWalletPersistence>(
      IDataWalletPersistenceType,
    );
    return persistence.postBackups();
  }

  // and to fetch a specific chunk and decrypt it.
  public unpackBackupChunk(
    backup: DataWalletBackup,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<string, PersistenceError> {
    const persistence = this.iocContainer.get<IDataWalletPersistence>(
      IDataWalletPersistenceType,
    );
    return persistence.unpackBackupChunk(backup);
  }

  public clearCloudStore(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.clearCloudStore();
  }

  public listFileNames(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<BackupFileName[], PersistenceError> {
    const persistence = this.iocContainer.get<IDataWalletPersistence>(
      IDataWalletPersistenceType,
    );
    return persistence.listFileNames();
  }

  public getTokenPrice(
    chainId: ChainId,
    address: TokenAddress,
    timestamp: UnixTimestamp,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<number, AccountIndexingError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getTokenPrice(chainId, address, timestamp);
  }

  public getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<TokenInfo | null, AccountIndexingError> {
    const tokenPriceRepo = this.iocContainer.get<ITokenPriceRepository>(
      ITokenPriceRepositoryType,
    );
    return tokenPriceRepo.getTokenInfo(chainId, contractAddress);
  }

  public getTokenMarketData(
    ids: string[],
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<TokenMarketData[], AccountIndexingError> {
    const tokenPriceRepo = this.iocContainer.get<ITokenPriceRepository>(
      ITokenPriceRepositoryType,
    );
    return tokenPriceRepo.getTokenMarketData(ids);
  }
}
