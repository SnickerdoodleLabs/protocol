import { CloudStorageActivatedEvent } from "@objects/businessObjects/events/CloudStorageActivatedEvent.js";
import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification.js";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification.js";

export class CloudProviderActivatedNotification extends BaseNotification<CloudStorageActivatedEvent> {
  constructor(protected event: CloudStorageActivatedEvent) {
    super(ENotificationTypes.CLOUD_STORAGE_ACTIVATED, event);
  }
}
