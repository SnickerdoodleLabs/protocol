import {
  DataWalletAddress,
  EarnedReward,
  EVMContractAddress,
  Invitation,
  LinkedAccount,
  SocialProfileLinkedEvent,
  UUID,
  AccountAddedNotification,
  AccountInitializedNotification,
  LinkAccountRequestedNotification,
  AccountRemovedNotification,
  EarnedRewardsAddedNotification,
  EProfileFieldType,
  ProfileFieldChangedNotification,
  SocialProfileLinkedNotification,
  CloudStorageActivatedEvent,
  CloudProviderActivatedNotification,
  ProfileFieldUpdate,
  CohortJoinedNotification,
  CohortLeftNotification,
  SDQLQueryRequest,
  QueryPostedNotification,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { Subject } from "rxjs";
import { v4 } from "uuid";

import { AccountContext } from "@synamint-extension-sdk/core/implementations/utilities/ContextProvider/AccountContext";
import { AppContext } from "@synamint-extension-sdk/core/implementations/utilities/ContextProvider/AppContext";
import {
  IContextProvider,
  IConfigProvider,
  IConfigProviderType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import {
  IInternalState,
  IExternalState,
} from "@synamint-extension-sdk/shared/interfaces/states";

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
      new AccountAddedNotification(linkedAccount),
    );
  }

  public onAccountRemoved(linkedAccount: LinkedAccount): void {
    this.appContext.notifyAllConnections(
      new AccountRemovedNotification(linkedAccount),
    );
  }

  public onEarnedRewardsAdded(rewards: EarnedReward[]): void {
    this.appContext.notifyAllConnections(
      new EarnedRewardsAddedNotification(rewards),
    );
  }

  public onSocialProfileLinked(event: SocialProfileLinkedEvent): void {
    this.appContext.notifyAllConnections(
      new SocialProfileLinkedNotification(event),
    );
  }

  public onCloudStorageActivated(event: CloudStorageActivatedEvent): void {
    this.appContext.notifyAllConnections(
      new CloudProviderActivatedNotification(event),
    );
  }

  public onCloudStorageDeactivated(event: CloudStorageActivatedEvent): void {
    this.appContext.notifyAllConnections(
      new CloudProviderActivatedNotification(event),
    );
  }

  public onCohortJoined(consentAddress: EVMContractAddress): void {
    this.appContext.notifyAllConnections(
      new CohortJoinedNotification(consentAddress),
    );
  }

  public onCohortLeft(consentAddress: EVMContractAddress): void {
    this.appContext.notifyAllConnections(
      new CohortLeftNotification(consentAddress),
    );
  }

  public onProfileFieldChanged(
    profileFieldType: EProfileFieldType,
    value: any,
  ): void {
    this.appContext.notifyAllConnections(
      new ProfileFieldChangedNotification(
        new ProfileFieldUpdate(profileFieldType, value),
      ),
    );
  }

  public onQueryPosted(event: SDQLQueryRequest): void {
    this.appContext.notifyAllConnections(new QueryPostedNotification(event));
  }

  public onLinkAccountRequested(): void {
    this.appContext.notifyAllConnections(new LinkAccountRequestedNotification());
  }

  private onAccountContextInitialized(
    dataWalletAddress: DataWalletAddress,
  ): void {
    this.appContext.notifyAllConnections(
      new AccountInitializedNotification(dataWalletAddress),
    );
  }
}
