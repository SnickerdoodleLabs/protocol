import {
  CloudStorageActivatedEvent,
  DataWalletAddress,
  EarnedReward,
  EProfileFieldType,
  ESolidityAbiParameterType,
  EVMContractAddress,
  IDynamicRewardParameter,
  IpfsCID,
  ISnickerdoodleCore,
  ISnickerdoodleCoreEvents,
  ISnickerdoodleCoreType,
  LinkedAccount,
  SDQLQueryRequest,
  SDQLString,
  SocialProfileLinkedEvent,
  SocialProfileUnlinkedEvent,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import Browser from "webextension-polyfill";

import { ICoreListener } from "@synamint-extension-sdk/core/interfaces/api";
import {
  IInvitationService,
  IInvitationServiceType,
} from "@synamint-extension-sdk/core/interfaces/business";
import {
  IContextProvider,
  IContextProviderType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { BrowserUtils } from "@synamint-extension-sdk/enviroment/shared/utils";

@injectable()
export class CoreListener implements ICoreListener {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IInvitationServiceType)
    protected invitationService: IInvitationService,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.core.getEvents().map((events: ISnickerdoodleCoreEvents) => {
      events.onInitialized.subscribe(this.onInitialized.bind(this));
      events.onAccountAdded.subscribe(this.onAccountAdded.bind(this));
      events.onAccountRemoved.subscribe(this.onAccountRemoved.bind(this));

      events.onEarnedRewardsAdded.subscribe(
        this.onEarnedRewardsAdded.bind(this),
      );
      events.onSocialProfileLinked.subscribe(
        this.onSocialProfileLinked.bind(this),
      );
      events.onSocialProfileUnlinked.subscribe(
        this.onSocialProfileUnlinked.bind(this),
      );

      events.onCohortJoined.subscribe(this.onChohortJoined.bind(this));

      events.onCohortLeft.subscribe(this.onCohortLeft.bind(this));

      events.onQueryPosted.subscribe(this.onQueryPosted.bind(this));

      // Add a listener for cloud storage being switched out

      // rename, event emitted from api listeners. keyed and activated by initialize function
      events.onCloudStorageActivated.subscribe(
        this.onCloudStorageActivated.bind(this),
      );
      events.onCloudStorageDeactivated.subscribe(
        this.onCloudStorageDeactivated.bind(this),
      );
      events.onBirthdayUpdated.subscribe((birthday) => {
        this.contextProvider.onProfileFieldChanged(
          EProfileFieldType.DOB,
          birthday,
        );
      });
      events.onGenderUpdated.subscribe((gender) => {
        this.contextProvider.onProfileFieldChanged(
          EProfileFieldType.GENDER,
          gender,
        );
      });
      events.onLocationUpdated.subscribe((location) => {
        this.contextProvider.onProfileFieldChanged(
          EProfileFieldType.LOCATION,
          location,
        );
      });
    });
  }

  private onInitialized(dataWalletAddress: DataWalletAddress): void {
    // @TODO move it to right place
    BrowserUtils.browserAction.getPopup({}).then((popup) => {
      if (!popup) {
        BrowserUtils.browserAction.setPopup({
          popup: Browser.runtime.getURL("popup.html"),
        });
      }
    });
    this.contextProvider.setAccountContext(dataWalletAddress);
    console.log(
      `Extension: Initialized data wallet with address ${dataWalletAddress}`,
    );
  }

  private onAccountAdded(account: LinkedAccount): void {
    this.contextProvider.onAccountAdded(account);
    console.log(`Extension: account ${account.sourceAccountAddress} added`);
  }

  private onChohortJoined(consentAddress: EVMContractAddress): void {
    this.contextProvider.onCohortJoined(consentAddress);
    console.log(`Extension: cohort ${consentAddress} joined`);
  }

  private onCohortLeft(consentAddress: EVMContractAddress): void {
    this.contextProvider.onCohortLeft(consentAddress);
    console.log(`Extension: cohort ${consentAddress} left`);
  }

  private onAccountRemoved(account: LinkedAccount): void {
    this.contextProvider.onAccountRemoved(account);
  }

  private onEarnedRewardsAdded(rewards: EarnedReward[]): void {
    this.contextProvider.onEarnedRewardsAdded(rewards);
  }

  private onSocialProfileLinked(event: SocialProfileLinkedEvent): void {
    this.contextProvider.onSocialProfileLinked(event);
  }

  private onSocialProfileUnlinked(event: SocialProfileUnlinkedEvent): void {}

  private onCloudStorageActivated(event: CloudStorageActivatedEvent): void {
    this.contextProvider.onCloudStorageActivated(event);
  }
  private onCloudStorageDeactivated(event: CloudStorageActivatedEvent): void {
    this.contextProvider.onCloudStorageDeactivated(event);
  }
  private onQueryPosted(event: SDQLQueryRequest) {
    console.log("Query posted", event);
    this.contextProvider.onQueryPosted(event);
  }
}
