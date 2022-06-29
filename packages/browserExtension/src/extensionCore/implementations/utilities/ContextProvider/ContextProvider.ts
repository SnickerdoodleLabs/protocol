import { IContextProvider } from "@interfaces/utilities";
import { Runtime } from "webextension-polyfill";
import { Subject } from "rxjs";
import { PortEvents, ClientEvents } from "@interfaces/objects";
import { AccountContext } from "@implementations/utilities/ContextProvider/AccountContext";
import { AppContext } from "@implementations/utilities/ContextProvider/AppContext";
import { UserContext } from "@implementations/utilities/ContextProvider/UserContext";
import { SiteContext } from "@implementations/utilities/ContextProvider/SiteContext";
import { IInternalState, IExternalState } from "@shared/objects/State";

export class ContextProvider implements IContextProvider {
  protected accountContext: AccountContext;
  protected appContext: AppContext;
  protected clientEvents: ClientEvents;
  protected userContext: UserContext;
  protected portEvents: PortEvents;
  protected siteContext: SiteContext;

  constructor() {
    this.accountContext = new AccountContext(() => {});
    this.appContext = new AppContext();
    this.portEvents = new PortEvents(new Subject<Runtime.Port>());
    this.clientEvents = new ClientEvents();
    this.userContext = new UserContext();
    this.siteContext = new SiteContext();
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

  public getUserContext() {
    return this.userContext;
  }

  public getInternalState(): IInternalState {
    return {
      walletAccount: this.accountContext.getAccount(),
      userConnectedAccounts: this.userContext.getAccounts(),
      pendingActions: this.appContext.getPendingActions(),
      name: this.userContext.getName(),
      email: this.userContext.getEmail(),
    };
  }

  public getExterenalState(): IExternalState {
    return {
      scamList: this.siteContext.getScamList(),
    };
  }

  public getClientEvents() {
    return this.clientEvents;
  }

  public setAccountContext() {
    console.log("not implemented");
  }
}
