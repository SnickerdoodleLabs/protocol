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
  ConsentConditions,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  CountryCode,
  CrumbsContractError,
  DomainName,
  EInvitationStatus,
  EmailAddressString,
  EvaluationError,
  EVMAccountAddress,
  EVMContractAddress,
  FamilyName,
  Gender,
  GivenName,
  IAccountBalances,
  IAccountBalancesType,
  IAccountIndexing,
  IAccountIndexingType,
  IConfigOverrides,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IEVMBalance,
  IEVMNFT,
  InvalidSignatureError,
  Invitation,
  IPFSError,
  ISnickerdoodleCore,
  ISnickerdoodleCoreEvents,
  LanguageCode,
  MinimalForwarderContractError,
  PageInvitation,
  PersistenceError,
  QueryFormatError,
  Signature,
  UninitializedError,
  UnixTimestamp,
  UnsupportedLanguageError,
  SDQLQuery,
  EVMTransaction,
  EVMTransactionFilter,
  IAccountNFTs,
  IAccountNFTsType,
  ChainId,
  URLString,
  SiteVisit,
} from "@snickerdoodlelabs/objects";
import { Container } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { DefaultDataWalletPersistence } from "@core/implementations/data";
import { snickerdoodleCoreModule } from "@core/implementations/SnickerdoodleCore.module";
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
  IProfileService,
  IProfileServiceType,
  IQueryService,
  IQueryServiceType,
} from "@core/interfaces/business";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities";

export class SnickerdoodleCore implements ISnickerdoodleCore {
  protected iocContainer: Container;
  protected profileService: IProfileService;

  public constructor(
    configOverrides?: IConfigOverrides,
    persistence?: IDataWalletPersistence,
    accountIndexer?: IAccountIndexing,
    accountBalances?: IAccountBalances,
    accountNFTs?: IAccountNFTs,
  ) {
    this.iocContainer = new Container();

    // Elaborate syntax to demonstrate that we can use multiple modules
    this.iocContainer.load(...[snickerdoodleCoreModule]);

    // If persistence is provided, we need to hook it up. If it is not, we will use the default
    // persistence.
    if (persistence != null) {
      this.iocContainer
        .bind(IDataWalletPersistenceType)
        .toConstantValue(persistence);
    } else {
      this.iocContainer
        .bind(IDataWalletPersistenceType)
        .to(DefaultDataWalletPersistence)
        .inSingletonScope();
    }
    this.profileService =
      this.iocContainer.get<IProfileService>(IProfileServiceType);

    // If an Account Indexer is provided, hook it up. If not we'll use the default.
    if (accountIndexer != null) {
      this.iocContainer
        .bind(IAccountIndexingType)
        .toConstantValue(accountIndexer);
    } else {
      this.iocContainer
        .bind(IAccountIndexingType)
        .to(DefaultAccountIndexers)
        .inSingletonScope();
    }

    // If an Account Balances is provided, hook it up. If not we'll use the default.
    if (accountBalances != null) {
      this.iocContainer
        .bind(IAccountBalancesType)
        .toConstantValue(accountBalances);
    } else {
      this.iocContainer
        .bind(IAccountBalancesType)
        .to(DefaultAccountBalances)
        .inSingletonScope();
    }

    if (accountNFTs != null) {
      this.iocContainer.bind(IAccountNFTsType).toConstantValue(accountNFTs);
    } else {
      this.iocContainer
        .bind(IAccountNFTsType)
        .to(DefaultAccountNFTs)
        .inSingletonScope();
    }

    // Setup the config
    if (configOverrides != null) {
      const configProvider =
        this.iocContainer.get<IConfigProvider>(IConfigProviderType);

      configProvider.setConfigOverrides(configOverrides);
    }
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
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | UnsupportedLanguageError
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | PersistenceError
    | InvalidSignatureError
    | AjaxError
    | CrumbsContractError
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
        return accountService.unlock(accountAddress, signature, languageCode);
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
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | PersistenceError
    | AjaxError
    | CrumbsContractError
  > {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);

    return accountService.addAccount(accountAddress, signature, languageCode);
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
    consentConditions: ConsentConditions | null,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | AjaxError
    | BlockchainProviderError
    | MinimalForwarderContractError
  > {
    const cohortService = this.iocContainer.get<IInvitationService>(
      IInvitationServiceType,
    );

    return cohortService.acceptInvitation(invitation, consentConditions);
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

    return queryService.processQuery(consentContractAddress, query);
  }

  public isDataWalletAddressInitialized(): ResultAsync<boolean, never> {
    const contextProvider =
      this.iocContainer.get<IContextProvider>(IContextProviderType);

    return contextProvider.getContext().map((context) => {
      return !!context.dataWalletAddress;
    });
  }

  setGivenName(name: GivenName): ResultAsync<void, PersistenceError> {
    return this.profileService.setGivenName(name);
  }
  getGivenName(): ResultAsync<GivenName | null, PersistenceError> {
    return this.profileService.getGivenName();
  }
  setFamilyName(name: FamilyName): ResultAsync<void, PersistenceError> {
    return this.profileService.setFamilyName(name);
  }
  getFamilyName(): ResultAsync<FamilyName | null, PersistenceError> {
    return this.profileService.getFamilyName();
  }
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, PersistenceError> {
    return this.profileService.setBirthday(birthday);
  }
  getBirthday(): ResultAsync<UnixTimestamp | null, PersistenceError> {
    return this.profileService.getBirthday();
  }
  setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    return this.profileService.setGender(gender);
  }
  getGender(): ResultAsync<Gender | null, PersistenceError> {
    return this.profileService.getGender();
  }
  setEmail(email: EmailAddressString): ResultAsync<void, PersistenceError> {
    return this.profileService.setEmail(email);
  }
  getEmail(): ResultAsync<EmailAddressString | null, PersistenceError> {
    return this.profileService.getEmail();
  }
  setLocation(location: CountryCode): ResultAsync<void, PersistenceError> {
    return this.profileService.setLocation(location);
  }
  getLocation(): ResultAsync<CountryCode | null, PersistenceError> {
    return this.profileService.getLocation();
  }
  setAge(age: Age): ResultAsync<void, PersistenceError> {
    return this.profileService.setAge(age);
  }
  getAge(): ResultAsync<Age | null, PersistenceError> {
    return this.profileService.getAge();
  }
  getAccounts(): ResultAsync<EVMAccountAddress[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getAccounts();
  }

  getTransactions(
    filter?: EVMTransactionFilter,
  ): ResultAsync<EVMTransaction[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getTranactions(filter);
  }

  getAccountBalances(): ResultAsync<IEVMBalance[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getAccountBalances();
  }

  getAccountNFTs(): ResultAsync<IEVMNFT[], PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getAccountNFTs();
  }

  getTransactionsMap(): ResultAsync<Map<ChainId, number>, PersistenceError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);
    return accountService.getTransactionsMap();
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
}
