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
  EVMTransaction,
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
  IDataWalletPersistence,
  IDataWalletPersistenceType,
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
  CeramicStreamID,
  EarnedReward,
  TokenBalance,
} from "@snickerdoodlelabs/objects";
import {
  ICloudStorage,
  ICloudStorageType,
  CeramicCloudStorage,
  IVolatileStorage,
  IVolatileStorageType,
  IndexedDBVolatileStorage,
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
  IInvitationService,
  IInvitationServiceType,
  IProfileService,
  IProfileServiceType,
  IQueryService,
  IQueryServiceType,
  ISiftContractService,
  ISiftContractServiceType,
} from "@core/interfaces/business/index.js";
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
        .to(CeramicCloudStorage)
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
  }

  public getConsentContractCID(
    consentAddress: EVMContractAddress,
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
  ): ResultAsync<
    EInvitationStatus,
    | BlockchainProviderError
    | PersistenceError
    | UninitializedError
    | AjaxError
    | ConsentContractError
    | ConsentContractRepositoryError
  > {
    const cohortService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return cohortService.checkInvitationStatus(invitation);
  }

  public acceptInvitation(
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | AjaxError
    | BlockchainProviderError
    | MinimalForwarderContractError
    | ConsentError
  > {
    const cohortService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return cohortService.acceptInvitation(invitation, dataPermissions);
  }

  public rejectInvitation(
    invitation: Invitation,
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
    const cohortService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return cohortService.rejectInvitation(invitation);
  }

  public leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    void,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | MinimalForwarderContractError
    | ConsentError
  > {
    const cohortService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return cohortService.leaveCohort(consentContractAddress);
  }

  public getInvitationsByDomain(
    domain: DomainName,
  ): ResultAsync<
    PageInvitation[],
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | IPFSError
  > {
    const cohortService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return cohortService.getInvitationsByDomain(domain);
  }

  public getAgreementFlags(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    HexString32,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | ConsentContractRepositoryError
    | AjaxError
    | ConsentError
  > {
    const cohortService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return cohortService.getAgreementFlags(consentContractAddress);
  }

  public getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | BlockchainProviderError
    | UninitializedError
    | PersistenceError
    | ConsentContractError
    | ConsentFactoryContractError
  > {
    const cohortService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return cohortService.getAvailableInvitationsCID();
  }

  public getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | ConsentFactoryContractError
  > {
    const cohortService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return cohortService.getAcceptedInvitationsCID();
  }
  public getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, IPFSError> {
    const cohortService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return cohortService.getInvitationMetadataByCID(ipfsCID);
  }

  public processQuery(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
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

    // console.log("core.processQuery")
    return queryService.processQuery(consentContractAddress, query);
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
  ): ResultAsync<
    EScamFilterStatus,
    BlockchainProviderError | UninitializedError | SiftContractError
  > {
    const siftService = this.iocContainer.get<ISiftContractService>(
      ISiftContractServiceType,
    );
    return siftService.checkURL(domain);
  }

  setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.setGivenName(name);
  }
  getGivenName(): ResultAsync<GivenName | null, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.getGivenName();
  }
  setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.setFamilyName(name);
  }
  getFamilyName(): ResultAsync<FamilyName | null, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.getFamilyName();
  }
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.setBirthday(birthday);
  }
  getBirthday(): ResultAsync<UnixTimestamp | null, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.getBirthday();
  }
  setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.setGender(gender);
  }
  getGender(): ResultAsync<Gender | null, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.getGender();
  }
  setEmail(email: EmailAddressString): ResultAsync<void, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.setEmail(email);
  }
  getEmail(): ResultAsync<EmailAddressString | null, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.getEmail();
  }
  setLocation(location: CountryCode): ResultAsync<void, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.setLocation(location);
  }
  getLocation(): ResultAsync<CountryCode | null, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.getLocation();
  }
  setAge(age: Age): ResultAsync<void, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.setAge(age);
  }
  getAge(): ResultAsync<Age | null, PersistenceError> {
    const profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);
    return profileService.getAge();
  }
  getAccounts(): ResultAsync<LinkedAccount[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getAccounts();
  }

  getTransactions(
    filter?: TransactionFilter,
  ): ResultAsync<ChainTransaction[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getTranactions(filter);
  }

  getAccountBalances(): ResultAsync<TokenBalance[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getAccountBalances();
  }

  getAccountNFTs(): ResultAsync<WalletNFT[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getAccountNFTs();
  }

  /*
  getTransactionsArray(): ResultAsync<{ chainId: ChainId; items: EVMTransaction[] | null; }[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getTransactionsArray();
  }
  */

  getTransactionsArray(): ResultAsync<ChainTransaction[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getTransactionsArray();
  }

  getSiteVisitsMap(): ResultAsync<Map<URLString, number>, PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getSiteVisitsMap();
  }
  getSiteVisits(): ResultAsync<SiteVisit[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getSiteVisits();
  }
  addSiteVisits(siteVisits: SiteVisit[]): ResultAsync<void, PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.addSiteVisits(siteVisits);
  }

  getEarnedRewards(): ResultAsync<EarnedReward[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getEarnedRewards();
  }
  addEarnedReward(reward: EarnedReward): ResultAsync<void, PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.addEarnedReward(reward);
  }

  public addTransactions(
    transactions: ChainTransaction[],
  ): ResultAsync<void, PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.addTransactions(transactions);
  }

  // public addEarnedReward(reward: EarnedReward): ResultAsync<void, PersistenceError> {
  //   const accountService =
  //     this.iocContainer.get<IAccountService>(IAccountServiceType);

  //   return accountService.addEarnedReward(reward);
  // }

  // public getEarnedRewards(): ResultAsync<EarnedReward[], PersistenceError> {
  //   const accountService =
  //     this.iocContainer.get<IAccountService>(IAccountServiceType);
  //   return accountService.getEarnedRewards();
  // }

  public dumpBackup(): ResultAsync<IDataWalletBackup, PersistenceError> {
    const persistence = this.iocContainer.get<IDataWalletPersistence>(
      IDataWalletPersistenceType,
    );
    return persistence.dumpBackup();
  }

  public restoreBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    const persistence = this.iocContainer.get<IDataWalletPersistence>(
      IDataWalletPersistenceType,
    );
    return persistence.restoreBackup(backup);
  }

  public postBackup(): ResultAsync<CeramicStreamID, PersistenceError> {
    const persistence = this.iocContainer.get<IDataWalletPersistence>(
      IDataWalletPersistenceType,
    );
    return persistence.postBackup();
  }

  public clearCloudStore(): ResultAsync<void, PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.clearCloudStore();
  }
}
