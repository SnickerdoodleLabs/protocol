import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification.js";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification.js";

export class LinkAccountRequestedNotification extends BaseNotification<undefined> {
  constructor() {
    super(ENotificationTypes.LINK_ACCOUNT_REQUESTED, undefined);
  }
}
