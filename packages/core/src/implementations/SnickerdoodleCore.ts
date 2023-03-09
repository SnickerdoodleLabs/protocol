/**
 * This is the main implementation of the Snickerdoodle Query Engine.
 *
 * Regardless of form factor, you need to instantiate an instance of
 */
import {
  DefaultAccountBalances,
  DefaultAccountIndexers,
  DefaultAccountNFTs,
} from "@snickerdoodlelabs/indexers";
import {
  Age,
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  ConsentFactoryContractError,
  CountryCode,
  CrumbsContractError,
  DataPermissions,
  DomainName,
  EInvitationStatus,
  EmailAddressString,
  EvaluationError,
  EVMContractAddress,
  TransactionFilter,
  FamilyName,
  Gender,
  GivenName,
  HexString32,
  IAccountBalancesType,
  IAccountIndexingType,
  IAccountNFTsType,
  IConfigOverrides,
  IDataWalletBackup,
  WalletNFT,
  InvalidParametersError,
  InvalidSignatureError,
  Invitation,
  IOpenSeaMetadata,
  IpfsCID,
  IPFSError,
  ISnickerdoodleCore,
  ISnickerdoodleCoreEvents,
  LanguageCode,
  MinimalForwarderContractError,
  PageInvitation,
  PersistenceError,
  QueryFormatError,
  SDQLQuery,
  SiftContractError,
  Signature,
  SiteVisit,
  UninitializedError,
  UnixTimestamp,
  UnsupportedLanguageError,
  URLString,
  EScamFilterStatus,
  ChainTransaction,
  EChain,
  LinkedAccount,
  AccountAddress,
  DataWalletAddress,
  EarnedReward,
  TokenAddress,
  TokenBalance,
  IDynamicRewardParameter,
  ChainId,
  DataWalletBackupID,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
  AccountIndexingError,
  TokenInfo,
  TokenMarketData,
  TransactionPaymentCounter,
  EDataWalletPermission,
  ICoreMarketplaceMethods,
  ICoreIntegrationMethods,
  EligibleAd,
  AdSignature,
  UnauthorizedError,
  PossibleReward,
  BackupFileName,
} from "@snickerdoodlelabs/objects";
import {
  ICloudStorage,
  ICloudStorageType,
  IVolatileStorage,
  IVolatileStorageType,
  IndexedDBVolatileStorage,
  GoogleCloudStorage,
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
} from "@core/interfaces/api/index.js";
import {
  IAccountService,
  IAccountServiceType,
  IAdService,
  IAdServiceType,
  ICampaignService,
  ICampaignServiceType,
  IIntegrationService,
  IIntegrationServiceType,
  IInvitationService,
  IInvitationServiceType,
  IMarketplaceService,
  IMarketplaceServiceType,
  IProfileService,
  IProfileServiceType,
  IQueryService,
  IQueryServiceType,
  ISiftContractService,
  ISiftContractServiceType,
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

  public marketplace: ICoreMarketplaceMethods;
  public integration: ICoreIntegrationMethods;

  public constructor(
    configOverrides?: IConfigOverrides,
    storageUtils?: IStorageUtils,
    volatileStorage?: IVolatileStorage,
    cloudStorage?: ICloudStorage,
  ) {
    this.iocContainer = new Container();

    // Elaborate syntax to demonstrate that we can use multiple modules
    this.iocContainer.load(...[snickerdoodleCoreModule]);

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

    if (cloudStorage != null) {
      this.iocContainer.bind(ICloudStorageType).toConstantValue(cloudStorage);
    } else {
      this.iocContainer
        .bind(ICloudStorageType)
        // .to(NullCloudStorage)
        .to(GoogleCloudStorage)
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

    this.iocContainer
      .bind(IAccountIndexingType)
      .to(DefaultAccountIndexers)
      .inSingletonScope();

    this.iocContainer
      .bind(IAccountBalancesType)
      .to(DefaultAccountBalances)
      .inSingletonScope();

    this.iocContainer
      .bind(IAccountNFTsType)
      .to(DefaultAccountNFTs)
      .inSingletonScope();

    // Setup the config
    if (configOverrides != null) {
      const configProvider =
        this.iocContainer.get<IConfigProvider>(IConfigProviderType);

      configProvider.setConfigOverrides(configOverrides);
    }

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
    };

    this.marketplace = {
      getMarketplaceListings: (
        count?: number | undefined,
        headAt?: number | undefined,
      ) => {
        const marketplaceService = this.iocContainer.get<IMarketplaceService>(
          IMarketplaceServiceType,
        );
        return marketplaceService.getMarketplaceListings(count, headAt);
      },
      getListingsTotal: () => {
        const marketplaceService = this.iocContainer.get<IMarketplaceService>(
          IMarketplaceServiceType,
        );
        return marketplaceService.getListingsTotal();
      },
      getPossibleRewards: (
        contractAddresses: EVMContractAddress[],
        timeoutMs?: number,
      ) => {
        const campaignService =
          this.iocContainer.get<ICampaignService>(ICampaignServiceType);
        return campaignService.getPossibleRewards(
          contractAddresses,
          timeoutMs ?? 3000,
        );
      },
    };
  }

  public getConsentContractCID(
    consentAddress: EVMContractAddress,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    IpfsCID,
    ConsentContractError | UninitializedError | BlockchainProviderError
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

  public getUnlockMessage(
    languageCode: LanguageCode,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<string, UnsupportedLanguageError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);

    return accountService.getUnlockMessage(languageCode);
  }

  /**
   * Very important method, as it serves two purposes- it initializes the core and effectively logs the user in.
   * The core doesn't do any query processing until it has been unlocked.
   * @param accountAddress
   * @param signature
   * @param languageCode
   * @returns
   */
  public unlock(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    void,
    | PersistenceError
    | AjaxError
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | MinimalForwarderContractError
  > {
    // Get all of our indexers and initialize them
    // TODO

    const blockchainProvider = this.iocContainer.get<IBlockchainProvider>(
      IBlockchainProviderType,
    );

    const accountIndexerPoller = this.iocContainer.get<IAccountIndexerPoller>(
      IAccountIndexerPollerType,
    );

    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);

    const blockchainListener = this.iocContainer.get<IBlockchainListener>(
      IBlockchainListenerType,
    );

    // BlockchainProvider needs to be ready to go in order to do the unlock
    return ResultUtils.combine([blockchainProvider.initialize()])
      .andThen(() => {
        return accountService.unlock(
          accountAddress,
          signature,
          languageCode,
          chain,
        );
      })
      .andThen(() => {
        return ResultUtils.combine([
          accountIndexerPoller.initialize(),
          blockchainListener.initialize(),
        ]);
      })
      .map(() => {});
  }

  public addAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | PersistenceError
    | AjaxError
    | MinimalForwarderContractError
  > {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);

    return accountService.addAccount(
      accountAddress,
      signature,
      languageCode,
      chain,
    );
  }

  public unlinkAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    void,
    | PersistenceError
    | InvalidParametersError
    | BlockchainProviderError
    | UninitializedError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | CrumbsContractError
    | AjaxError
    | MinimalForwarderContractError
  > {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);

    return accountService.unlinkAccount(
      accountAddress,
      signature,
      languageCode,
      chain,
    );
  }

  public getDataWalletForAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    DataWalletAddress | null,
    | PersistenceError
    | UninitializedError
    | BlockchainProviderError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
  > {
    const blockchainProvider = this.iocContainer.get<IBlockchainProvider>(
      IBlockchainProviderType,
    );

    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);

    // BlockchainProvider needs to be ready to go in order to do the unlock
    return blockchainProvider.initialize().andThen(() => {
      return accountService.getDataWalletForAccount(
        accountAddress,
        signature,
        languageCode,
        chain,
      );
    });
  }

  public checkInvitationStatus(
    invitation: Invitation,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    EInvitationStatus,
    | BlockchainProviderError
    | PersistenceError
    | UninitializedError
    | AjaxError
    | ConsentContractError
    | ConsentContractRepositoryError
  > {
    const invitationService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return invitationService.checkInvitationStatus(invitation);
  }

  public acceptInvitation(
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | AjaxError
    | BlockchainProviderError
    | MinimalForwarderContractError
    | ConsentError
  > {
    const invitationService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return invitationService.acceptInvitation(invitation, dataPermissions);
  }

  public rejectInvitation(
    invitation: Invitation,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | PersistenceError
    | UninitializedError
    | ConsentError
    | AjaxError
    | ConsentContractError
    | ConsentContractRepositoryError
  > {
    const invitationService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return invitationService.rejectInvitation(invitation);
  }

  public leaveCohort(
    consentContractAddress: EVMContractAddress,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | AjaxError
    | PersistenceError
    | MinimalForwarderContractError
    | ConsentError
  > {
    const invitationService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return invitationService.leaveCohort(consentContractAddress);
  }

  public getAcceptedInvitations(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<Invitation[], PersistenceError> {
    const invitationService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return invitationService.getAcceptedInvitations();
  }

  public getInvitationsByDomain(
    domain: DomainName,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    PageInvitation[],
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | IPFSError
  > {
    const invitationService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return invitationService.getInvitationsByDomain(domain);
  }

  public getAgreementFlags(
    consentContractAddress: EVMContractAddress,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    HexString32,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | ConsentFactoryContractError
    | PersistenceError
    | ConsentError
  > {
    const invitationService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return invitationService.getAgreementFlags(consentContractAddress);
  }

  public getAvailableInvitationsCID(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | BlockchainProviderError
    | UninitializedError
    | PersistenceError
    | ConsentContractError
    | ConsentFactoryContractError
  > {
    const invitationService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return invitationService.getAvailableInvitationsCID();
  }

  public getAcceptedInvitationsCID(
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | ConsentFactoryContractError
    | PersistenceError
  > {
    const invitationService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return invitationService.getAcceptedInvitationsCID();
  }
  public getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<IOpenSeaMetadata, IPFSError> {
    const invitationService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return invitationService.getInvitationMetadataByCID(ipfsCID);
  }

  public processQuery(
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
  > {
    const queryService =
      this.iocContainer.get<IQueryService>(IQueryServiceType);

    return queryService.processQuery(consentContractAddress, query, parameters);
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
    BlockchainProviderError | UninitializedError | SiftContractError
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

  getEarnedRewards(
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
    backup: IDataWalletBackup,
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
  ): ResultAsync<IDataWalletBackup[], PersistenceError> {
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
    backup: IDataWalletBackup,
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
    address: TokenAddress | null,
    timestamp: UnixTimestamp,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<number, AccountIndexingError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getTokenPrice(chainId, address, timestamp);
  }

  public getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
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

  public grantPermissions(
    permissions: EDataWalletPermission[],
    domain: DomainName,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public getPermissions(
    domain: DomainName,
    sourceDomain: DomainName | undefined = undefined,
  ): ResultAsync<EDataWalletPermission[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
}
