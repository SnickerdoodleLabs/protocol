/**
 * This is the main implementation of the Snickerdoodle Query Engine.
 *
 * Regardless of form factor, you need to instantiate an instance of
 */

import {
  BlockchainProviderError,
  ConsentError,
  CountryCode,
  EthereumAccountAddress,
  InvalidSignatureError,
  IpfsCID,
  IQueryEngine,
  IQueryEngineEvents,
  LanguageCode,
  Signature,
  UninitializedError,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";
import { Container } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { queryEngineModule } from "@core/implementations/QueryEngineModule";
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

export class QueryEngine implements IQueryEngine {
  protected iocContainer: Container;

  public constructor() {
    this.iocContainer = new Container();

    // Elaborate syntax to demonstrate that we can use multiple modules
    this.iocContainer.load(...[queryEngineModule]);
  }

  public getEvents(): ResultAsync<IQueryEngineEvents, never> {
    const contextProvider =
      this.iocContainer.get<IContextProvider>(IContextProviderType);

    return contextProvider.getContext().map((context) => {
      return context.publicEvents;
    });
  }

  public getLoginMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, UnsupportedLanguageError> {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);

    return accountService.getLoginMessage(languageCode);
  }

  public login(
    accountAddress: EthereumAccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
  ): ResultAsync<
    void,
    BlockchainProviderError | InvalidSignatureError | UnsupportedLanguageError
  > {
    const accountService =
      this.iocContainer.get<IAccountService>(IAccountServiceType);

    return accountService.login(accountAddress, signature, languageCode);
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
