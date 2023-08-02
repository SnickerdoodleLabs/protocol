import { CloudProviderSelectedEvent } from "@objects/businessObjects";
import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";
import { ECloudStorageType } from "@objects/enum";
import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";

export class CloudProviderSelectedNotification extends BaseNotification<CloudProviderSelectedEvent> {
    constructor(protected event: CloudProviderSelectedEvent) {
        super(ENotificationTypes.CLOUD_STORAGE_ALTERED, event);
    }
}
