import { IClientEventListener } from "@interfaces/api/IClientEventListener";
import { IAccountService } from "@interfaces/business";
import { IAddAccount, IGetUnlockMessage, IUnlock } from "@interfaces/objects";
import { IContextProvider } from "@interfaces/utilities";
import { okAsync, ResultAsync } from "neverthrow";

export class ClientEventsListener implements IClientEventListener {
  constructor(
    protected contextProvider: IContextProvider,
    protected accountService: IAccountService,
  ) {}

  public initialize(): ResultAsync<void, never> {
    const clientEvents = this.contextProvider.getClientEvents();
    clientEvents.onUnlockRequest.subscribe(this.onUnlockRequest.bind(this));
    clientEvents.onAddAccountRequest.subscribe(
      this.onAddAccountRequest.bind(this),
    );
    clientEvents.onUnlockMessageRequest.subscribe(
      this.onUnlockMessageRequest.bind(this),
    );

    return okAsync(undefined);
  }

  private onAddAccountRequest(args: IAddAccount) {
    const {
      params: { accountAddress, signature, languageCode },
      resolvers: { resolveError, resolveResult },
    } = args;
    this.accountService
      .addAccount(accountAddress, signature, languageCode)
      .mapErr((e) => resolveError(e))
      .map(() => resolveResult());
  }

  private onUnlockRequest(args: IUnlock) {
    const {
      params: { accountAddress, signature, languageCode },
      resolvers: { resolveError, resolveResult },
    } = args;
    this.accountService
      .addAccount(accountAddress, signature, languageCode)
      .mapErr((e) => resolveError(e))
      .map(() => resolveResult());
  }

  private onUnlockMessageRequest(args: IGetUnlockMessage) {
    const {
      params: { languageCode },
      resolvers: { resolveError, resolveResult },
    } = args;
    this.accountService
      .getUnlockMessage(languageCode)
      .mapErr((e) => resolveError(e))
      .map((message) => resolveResult(message));
  }
}
