import { CloudProviderActivatedEvent } from "@objects/businessObjects";
import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";
import { ECloudStorageType } from "@objects/enum";
import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";

export class CloudProviderActivatedNotification extends BaseNotification<CloudProviderActivatedEvent> {
  constructor(protected event: CloudProviderActivatedEvent) {
    super(ENotificationTypes.CLOUD_STORAGE_ACTIVATED, event);
  }
}
