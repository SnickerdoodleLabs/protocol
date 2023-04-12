import {
  DataWalletAddress,
  EarnedReward,
  EVMContractAddress,
  Invitation,
  LinkedAccount,
  UUID,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { Subject } from "rxjs";
import { v4 } from "uuid";

import { AccountContext } from "@synamint-extension-sdk/core/implementations/utilities/ContextProvider/AccountContext";
import { AppContext } from "@synamint-extension-sdk/core/implementations/utilities/ContextProvider/AppContext";
import { IContextProvider } from "@synamint-extension-sdk/core/interfaces/utilities";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@synamint-extension-sdk/shared/interfaces/configProvider";
import {
  IInternalState,
  IExternalState,
} from "@synamint-extension-sdk/shared/interfaces/states";
import {
  AccountAddedNotification,
  AccountInitializedNotification,
  AccountRemovedNotification,
  EarnedRewardsAddedNotification,
} from "@synamint-extension-sdk/shared/objects/notifications";

@injectable()
export class ContextProvider implements IContextProvider {
  protected accountContext: AccountContext;
  protected appContext: AppContext;
  protected onExtensionError: Subject<Error>;

  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {
    this.accountContext = new AccountContext(
      this.onAccountContextInitialized.bind(this),
    );
    this.appContext = new AppContext();
    this.onExtensionError = new Subject();
  }

  // context getters
  public getAccountContext(): AccountContext {
    return this.accountContext;
  }

  public getAppContext(): AppContext {
    return this.appContext;
  }

  public addInvitation(invitation: Invitation): UUID {
    return this.appContext.addInvitation(invitation);
  }

  public getInvitation(id: UUID): Invitation | undefined {
    return this.appContext.getInvitation(id);
  }

  public getErrorSubject(): Subject<Error> {
    return this.onExtensionError;
  }

  public getInternalState(): IInternalState {
    return {
      dataWalletAddress: this.accountContext.getAccount(),
    };
  }

  public getExterenalState(): IExternalState {
    return {
      dataWalletAddress: this.accountContext.getAccount(),
    };
  }

  public setAccountContext(dataWalletAddress: DataWalletAddress): void {
    this.accountContext.initialize(dataWalletAddress);
  }

  // port notifiers

  public onAccountAdded(linkedAccount: LinkedAccount): void {
    this.appContext.notifyAllConnections(
      new AccountAddedNotification({ linkedAccount }, UUID(v4())),
    );
  }

  public onAccountRemoved(linkedAccount: LinkedAccount): void {
    this.appContext.notifyAllConnections(
      new AccountRemovedNotification({ linkedAccount }, UUID(v4())),
    );
  }

  public onEarnedRewardsAdded(rewards: EarnedReward[]): void {
    this.appContext.notifyAllConnections(
      new EarnedRewardsAddedNotification({ rewards }, UUID(v4())),
    );
  }

  private onAccountContextInitialized(
    dataWalletAddress: DataWalletAddress,
  ): void {
    this.appContext.notifyAllConnections(
      new AccountInitializedNotification({ dataWalletAddress }, UUID(v4())),
    );
  }
}
