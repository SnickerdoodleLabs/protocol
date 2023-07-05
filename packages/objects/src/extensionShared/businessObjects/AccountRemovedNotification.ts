import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";
import { LinkedAccount } from "@objects/businessObjects/versioned/LinkedAccount";

export class AccountRemovedNotification extends BaseNotification {
  constructor(
    public data: {
      linkedAccount: LinkedAccount;
    },
  ) {
    super(ENotificationTypes.ACCOUNT_REMOVED);
  }
}
