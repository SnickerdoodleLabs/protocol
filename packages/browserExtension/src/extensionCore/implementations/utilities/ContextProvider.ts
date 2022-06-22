import { IContextProvider } from "@interfaces/utilities";
import { Runtime } from "webextension-polyfill";
import { Subject } from "rxjs";
import {
  EthereumAccountAddress,
  LanguageCode,
  Signature,
} from "@snickerdoodlelabs/objects";
import { AccountContext, PortEvents, ClientEvents } from "@interfaces/objects";
import { okAsync, ResultAsync } from "neverthrow";

export class ContextProvider implements IContextProvider {
  protected accountContext: AccountContext;
  protected portEvents: PortEvents;
  protected clientEvents: ClientEvents;

  constructor() {
    this.accountContext = new AccountContext(null, false);

    this.portEvents = new PortEvents(new Subject<Runtime.Port>());

    this.clientEvents = new ClientEvents();
  }

  public getPortEvents(): ResultAsync<PortEvents, never> {
    return okAsync(this.portEvents);
  }

  public getAccountContext(): ResultAsync<AccountContext, never> {
    return okAsync(this.accountContext);
  }

  public getClientEvents(): ResultAsync<ClientEvents, never> {
    return okAsync(this.clientEvents);
  }

  public setAccountContext() {
    console.log("not implemented");
  }
}
