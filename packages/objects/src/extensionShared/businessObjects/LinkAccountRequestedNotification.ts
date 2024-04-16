import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";

export class LinkAccountRequestedNotification extends BaseNotification<undefined> {
  constructor() {
    super(ENotificationTypes.LINK_ACCOUNT_REQUESTED, undefined);
  }
}
