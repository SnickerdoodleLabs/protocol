import { LinkedAccount } from "@objects/businessObjects/versioned/LinkedAccount.js";
import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification.js";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification.js";

export class AccountRemovedNotification extends BaseNotification<LinkedAccount> {
  constructor(protected linkedAccount: LinkedAccount) {
    super(ENotificationTypes.ACCOUNT_REMOVED, linkedAccount);
  }
}
