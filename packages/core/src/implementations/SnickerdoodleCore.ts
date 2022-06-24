/**
 * This is the main implementation of the Snickerdoodle Query Engine.
 *
 * Regardless of form factor, you need to instantiate an instance of
 */

import {
  BlockchainProviderError,
  ConsentError,
  EthereumAccountAddress,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  InvalidSignatureError,
  IpfsCID,
  IQueryEngineEvents,
  ISnickerdoodleCore,
  LanguageCode,
  PersistenceError,
  Signature,
  UninitializedError,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";
import { Container } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { DefaultDataWalletPersistence } from "@core/implementations/data";
import { snickerdoodleCoreModule } from "@core/implementations/SnickerdoodleCore.module";
import {
  IAccountService,
  IAccountServiceType,
  IQueryService,
  IQueryServiceType,
} from "@core/interfaces/business";
import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities";

export class SnickerdoodleCore implements ISnickerdoodleCore {
  protected iocContainer: Container;

  public constructor(persistence?: IDataWalletPersistence) {
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
    accountAddress: EthereumAccountAddress,
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
    accountAddress: EthereumAccountAddress,
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

  public addData(): ResultAsync<void, never> {
    return okAsync(undefined);
  }

  public processQuery(
    queryId: IpfsCID,
  ): ResultAsync<void, UninitializedError | ConsentError> {
    const queryService =
      this.iocContainer.get<IQueryService>(IQueryServiceType);

    return queryService.processQuery(queryId);
  }
}
