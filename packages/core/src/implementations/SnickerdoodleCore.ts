/**
 * This is the main implementation of the Snickerdoodle Query Engine.
 *
 * Regardless of form factor, you need to instantiate an instance of
 */

import { DefaultAccountIndexers } from "@snickerdoodlelabs/indexers";
import {
  Age,
  AjaxError,
  BlockchainProviderError,
  CohortInvitation,
  ConsentConditions,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  EInvitationStatus,
  EmailAddressString,
  FirstName,
  Gender,
  EVMAccountAddress,
  EVMContractAddress,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  InvalidSignatureError,
  IpfsCID,
  IPFSError,
  IQueryEngineEvents,
  ISnickerdoodleCore,
  LanguageCode,
  LastName,
  Location,
  PersistenceError,
  Signature,
  UninitializedError,
  UnixTimestamp,
  UnsupportedLanguageError,
  IAccountIndexing,
  IAccountIndexingType,
  IConfigOverrides,
} from "@snickerdoodlelabs/objects";
import { Container } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { DefaultDataWalletPersistence } from "@core/implementations/data";
import { snickerdoodleCoreModule } from "@core/implementations/SnickerdoodleCore.module";
import {
  IAccountService,
  IAccountServiceType,
  ICohortService,
  ICohortServiceType,
  IQueryService,
  IQueryServiceType,
} from "@core/interfaces/business";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities";

export class SnickerdoodleCore implements ISnickerdoodleCore {
  protected iocContainer: Container;
  protected _persistence: IDataWalletPersistence;

  public constructor(
    configOverrides?: IConfigOverrides,
    persistence?: IDataWalletPersistence,
    accountIndexer?: IAccountIndexing,
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
    this._persistence = this.iocContainer.get<IDataWalletPersistence>(
      IDataWalletPersistenceType,
    );

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

    // Setup the config
    if (configOverrides != null) {
      const configProvider =
        this.iocContainer.get<IConfigProvider>(IConfigProviderType);

      configProvider.setConfigOverrides(configOverrides);
    }
  }

  public getEvents(): ResultAsync<IQueryEngineEvents, never> {
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

  public unlock(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | PersistenceError
  > {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);

    return accountService.unlock(accountAddress, signature, languageCode);
  }

  public addAccount(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | InvalidSignatureError
    | UninitializedError
    | UnsupportedLanguageError
    | PersistenceError
  > {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);

    return accountService.addAccount(accountAddress, signature, languageCode);
  }

  public checkInvitationStatus(
    invitation: CohortInvitation,
  ): ResultAsync<
    EInvitationStatus,
    | BlockchainProviderError
    | PersistenceError
    | UninitializedError
    | AjaxError
    | ConsentContractError
    | ConsentContractRepositoryError
  > {
    const cohortService =
      this.iocContainer.get<ICohortService>(ICohortServiceType);

    return cohortService.checkInvitationStatus(invitation);
  }

  public acceptInvitation(
    invitation: CohortInvitation,
    consentConditions: ConsentConditions | null,
  ): ResultAsync<void, AjaxError | UninitializedError | PersistenceError> {
    const cohortService =
      this.iocContainer.get<ICohortService>(ICohortServiceType);

    return cohortService.acceptInvitation(invitation, consentConditions);
  }

  public rejectInvitation(
    invitation: CohortInvitation,
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
    const cohortService =
      this.iocContainer.get<ICohortService>(ICohortServiceType);

    return cohortService.rejectInvitation(invitation);
  }

  public leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | AjaxError
    | ConsentContractError
    | ConsentContractRepositoryError
    | ConsentError
  > {
    const cohortService =
      this.iocContainer.get<ICohortService>(ICohortServiceType);

    return cohortService.leaveCohort(consentContractAddress);
  }

  public processQuery(
    queryId: IpfsCID,
  ): ResultAsync<void, AjaxError | UninitializedError | ConsentError | IPFSError> {
    const queryService =
      this.iocContainer.get<IQueryService>(IQueryServiceType);

    return queryService.processQuery(queryId);
  }

  setFirstName(name: FirstName): ResultAsync<void, PersistenceError> {
    return this._persistence.setFirstName(name);
  }
  getFirstName(): ResultAsync<FirstName, PersistenceError> {
    return this._persistence.getFirstName();
  }
  setLastName(name: LastName): ResultAsync<void, PersistenceError> {
    return this._persistence.setLastName(name);
  }
  getLastName(): ResultAsync<LastName, PersistenceError> {
    return this._persistence.getLastName();
  }
  setBirthday(birthday: UnixTimestamp): ResultAsync<void, PersistenceError> {
    return this._persistence.setBirthday(birthday);
  }
  getBirthday(): ResultAsync<UnixTimestamp, PersistenceError> {
    return this._persistence.getBirthday();
  }
  setGender(gender: Gender): ResultAsync<void, PersistenceError> {
    return this._persistence.setGender(gender);
  }
  getGender(): ResultAsync<Gender, PersistenceError> {
    return this._persistence.getGender();
  }
  setEmail(email: EmailAddressString): ResultAsync<void, PersistenceError> {
    return this._persistence.setEmail(email);
  }
  getEmail(): ResultAsync<EmailAddressString, PersistenceError> {
    return this._persistence.getEmail();
  }
  setLocation(location: Location): ResultAsync<void, PersistenceError> {
    return this._persistence.setLocation(location);
  }
  getLocation(): ResultAsync<Location, PersistenceError> {
    return this._persistence.getLocation();
  }
  setAge(age: Age): ResultAsync<void, PersistenceError> {
    return this._persistence.setAge(age);
  }
  getAge(): ResultAsync<Age, PersistenceError> {
    return this._persistence.getAge();
  }
}
