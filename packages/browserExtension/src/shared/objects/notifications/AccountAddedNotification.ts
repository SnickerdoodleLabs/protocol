import { LinkedAccount, UUID } from "@snickerdoodlelabs/objects";

import { ENotificationTypes } from "@shared/enums/notification";
import { BaseNotification } from "@shared/objects/notifications/BaseNotification";

export class AccountAddedNotification extends BaseNotification {
  constructor(
    public data: {
      linkedAccount: LinkedAccount;
    },
    public key: UUID,
  ) {
    super(ENotificationTypes.ACCOUNT_ADDED);
  }
}
