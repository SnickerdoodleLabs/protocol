import { IContextProvider } from "@interfaces/utilities";
import { ClientEvents } from "@interfaces/objects";
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
  protected siteContext: SiteContext;

  constructor() {
    this.accountContext = new AccountContext(() => {});
    this.appContext = new AppContext();
    this.clientEvents = new ClientEvents();
    this.userContext = new UserContext();
    this.siteContext = new SiteContext();
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
      whiteList: this.siteContext.getWhiteList(),
      yellowList: this.siteContext.getYellowList(),
    };
  }

  public getClientEvents() {
    return this.clientEvents;
  }

  public setAccountContext() {
    console.log("not implemented");
  }
}
