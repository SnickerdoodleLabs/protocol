import {
  DataWalletAddress,
  Invitation,
  MetatransactionSignatureRequest,
  UUID,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { Subject } from "rxjs";

import { AccountContext } from "@implementations/utilities/ContextProvider/AccountContext";
import { AppContext } from "@implementations/utilities/ContextProvider/AppContext";
import { SiteContext } from "@implementations/utilities/ContextProvider/SiteContext";
import { UserContext } from "@implementations/utilities/ContextProvider/UserContext";
import { IContextProvider } from "@interfaces/utilities";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@shared/interfaces/configProvider";
import { IInternalState, IExternalState } from "@shared/interfaces/states";
import { MTSRNotification } from "@shared/objects/notifications/MTSRNotification";
import { AccountInitializedNotification } from "@shared/objects/notifications/AccountInitializedNotification";
import { v4 } from "uuid";

@injectable()
export class ContextProvider implements IContextProvider {
  protected accountContext: AccountContext;
  protected appContext: AppContext;
  protected userContext: UserContext;
  protected siteContext: SiteContext;
  protected onExtensionError: Subject<Error>;

  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {
    this.accountContext = new AccountContext(
      this.onAccountContextInitialized.bind(this),
    );
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
      // eslint-disable-next-line @typescript-eslint/no-this-alias
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
  public removePendingMetatransactionSignatureRequest(id: UUID): void {
    this.appContext.removeMetatransactionSignatureRequestWithId(id);
  }
  public getMetatransactionSignatureRequestById(
    id: UUID,
  ): MetatransactionSignatureRequest | undefined {
    return this.appContext.getMetatransactionSignatureRequestById(id);
  }
  public addInvitation(invitation: Invitation): UUID {
    return this.appContext.addInvitation(invitation);
  }
  public getInvitation(id: UUID): Invitation | undefined {
    return this.appContext.getInvitation(id);
  }

  public getInternalState(): IInternalState {
    return {
      dataWalletAddress: this.accountContext.getAccount(),
    };
  }

  public getExterenalState(): IExternalState {
    return {
      dataWalletAddress: this.accountContext.getAccount(),
      scamList: this.siteContext.getScamList(),
      whiteList: this.siteContext.getWhiteList(),
    };
  }

  public getErrorSubject(): Subject<Error> {
    return this.onExtensionError;
  }

  public setAccountContext(dataWalletAddress: DataWalletAddress): void {
    this.accountContext.initialize(dataWalletAddress);
  }

  private onAccountContextInitialized(dataWalletAddress: DataWalletAddress) {
    this.appContext.notifyAllConnections(
      new AccountInitializedNotification({ dataWalletAddress }, UUID(v4())),
    );
  }
}
