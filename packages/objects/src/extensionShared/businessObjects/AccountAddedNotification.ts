import { LinkedAccount } from "@objects/businessObjects/versioned/LinkedAccount";
import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";

export class AccountAddedNotification extends BaseNotification<LinkedAccount> {
  constructor(protected linkedAccount: LinkedAccount) {
    super(ENotificationTypes.ACCOUNT_ADDED, linkedAccount);
  }
}
