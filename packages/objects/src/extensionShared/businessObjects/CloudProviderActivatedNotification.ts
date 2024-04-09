import { CloudStorageActivatedEvent } from "@objects/businessObjects";
import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";
import { ECloudStorageType } from "@objects/enum";
import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";

export class CloudProviderActivatedNotification extends BaseNotification<CloudStorageActivatedEvent> {
  constructor(protected event: CloudStorageActivatedEvent) {
    super(ENotificationTypes.CLOUD_STORAGE_ACTIVATED, event);
  }
}
