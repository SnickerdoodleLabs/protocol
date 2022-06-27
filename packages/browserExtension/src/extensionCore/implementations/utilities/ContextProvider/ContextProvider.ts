import { IContextProvider } from "@interfaces/utilities";
import { Runtime } from "webextension-polyfill";
import { Subject } from "rxjs";
import { PortEvents, ClientEvents } from "@interfaces/objects";
import { AccountContext } from "@implementations/utilities/ContextProvider/AccountContext";
import { AppContext } from "@implementations/utilities/ContextProvider/AppContext";

export class ContextProvider implements IContextProvider {
  protected accountContext: AccountContext;
  protected appContext: AppContext;
  protected clientEvents: ClientEvents;
  protected portEvents: PortEvents;

  constructor() {
    this.accountContext = new AccountContext(() => {});
    this.appContext = new AppContext();
    this.portEvents = new PortEvents(new Subject<Runtime.Port>());
    this.clientEvents = new ClientEvents();
  }

  public getPortEvents() {
    return this.portEvents;
  }

  public getAccountContext() {
    return this.accountContext;
  }

  public getAppContext() {
    return this.appContext;
  }

  public getClientEvents() {
    return this.clientEvents;
  }

  public setAccountContext() {
    console.log("not implemented");
  }
}
