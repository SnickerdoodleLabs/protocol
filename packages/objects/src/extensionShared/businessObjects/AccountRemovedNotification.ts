import { LinkedAccount } from "@objects/businessObjects/versioned/LinkedAccount";
import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";

export class AccountRemovedNotification extends BaseNotification<LinkedAccount> {
  constructor(protected linkedAccount: LinkedAccount) {
    super(ENotificationTypes.ACCOUNT_REMOVED, linkedAccount);
  }
}
