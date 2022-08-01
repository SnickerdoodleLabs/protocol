import { IContextProvider } from "@interfaces/utilities";
import { AccountContext } from "@implementations/utilities/ContextProvider/AccountContext";
import { AppContext } from "@implementations/utilities/ContextProvider/AppContext";
import { UserContext } from "@implementations/utilities/ContextProvider/UserContext";
import { SiteContext } from "@implementations/utilities/ContextProvider/SiteContext";
import { IInternalState, IExternalState } from "@shared/interfaces/states";
import { Subject } from "rxjs";
import {
  MetatransactionSignatureRequest,
  UUID,
} from "@snickerdoodlelabs/objects";
import { IConfigProvider } from "@shared/interfaces/configProvider";
import { MTSRNotification } from "@shared/objects/notifications/MTSRNotification";

export class ContextProvider implements IContextProvider {
  protected accountContext: AccountContext;
  protected appContext: AppContext;
  protected userContext: UserContext;
  protected siteContext: SiteContext;
  protected onExtensionError: Subject<Error>;

  constructor(protected configProvider: IConfigProvider) {
    this.accountContext = new AccountContext(() => {});
    this.appContext = new AppContext();
    this.userContext = new UserContext();
    this.siteContext = new SiteContext();
    this.onExtensionError = new Subject();
  }

  public getAccountContext(): AccountContext {
    return this.accountContext;
  }

  public getAppContext(): AppContext {
    return this.appContext;
  }

  public getUserContext(): UserContext {
    return this.userContext;
  }

  // TODO move it to service layer
  public notifyPortsWithIncomingMetatransactionSignatureRequest(
    metatransactionSignatureRequest: MetatransactionSignatureRequest,
  ) {
    const { accountAddress, contractAddress, data } =
      metatransactionSignatureRequest;
    const SPAOrigin = new URL(this.configProvider.getConfig().onboardingUrl)
      .origin;

    const id = this.appContext.addMetatransactionSignatureRequest(
      metatransactionSignatureRequest,
    );

    const notification = new MTSRNotification(
      { accountAddress, contractAddress, data },
      id,
    );

    const SPAConnections =
      this.appContext.getActiveRpcConnectionObjectsByOrigin(SPAOrigin);

    if (SPAConnections.length) {
      const _this = this;
      SPAConnections.forEach((connection) => {
        _this.appContext.notifyConnectionPort(connection.engine, notification);
      });
    } else {
      this.appContext.notifyAllConnections(notification);
    }
  }
  // TODO move it to service layer
  public getPendingMetatransactionSignatureRequestDetails(
    id: UUID,
  ): Partial<MetatransactionSignatureRequest> | undefined {
    const metatransactionSignatureRequest =
      this.appContext.getMetatransactionSignatureRequestById(id);
    if (!metatransactionSignatureRequest) {
      return undefined;
    }
    const { accountAddress, contractAddress, data } =
      metatransactionSignatureRequest;
    return { accountAddress, contractAddress, data };
  }
  public getMetatransactionSignatureRequestById(
    id: UUID,
  ): MetatransactionSignatureRequest | undefined {
    return this.appContext.getMetatransactionSignatureRequestById(id);
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
    };
  }

  public getErrorSubject(): Subject<Error> {
    return this.onExtensionError;
  }

  public setAccountContext() {
    console.log("not implemented");
  }
}
