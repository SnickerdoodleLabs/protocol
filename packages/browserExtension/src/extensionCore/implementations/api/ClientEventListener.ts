import { IClientEventListener } from "@interfaces/api/IClientEventListener";
import { IAddAccount, IGetLoginMessage, ILogin } from "@interfaces/objects";
import { IContextProvider } from "@interfaces/utilities";
import { ok, okAsync, ResultAsync } from "neverthrow";

export class ClientEventsListener implements IClientEventListener {
  constructor(protected contextProvider: IContextProvider) {}

  public initialize(): ResultAsync<void, never> {
    const clientEvents = this.contextProvider.getClientEvents();
    clientEvents.onLoginRequest.subscribe(this.onLoginRequest.bind(this));
    clientEvents.onAddAccountRequest.subscribe(
      this.onAddAccountRequest.bind(this),
    );
    clientEvents.onLoginMessageRequest.subscribe(
      this.onLoginMessageRequest.bind(this),
    );

    return okAsync(undefined);
  }

  private onAddAccountRequest(args: IAddAccount) {
    console.log("requested with params", args.params);
    args.resolvers.resolveResult("fake result");
  }

  private onLoginRequest(args: ILogin) {
    console.log("requested with params", args.params);
    args.resolvers.resolveResult("fake result");
  }

  private onLoginMessageRequest(args: IGetLoginMessage) {
    console.log("requested with params", args.params);
    args.resolvers.resolveResult("fake result");
  }
}
