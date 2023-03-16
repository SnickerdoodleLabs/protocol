import { LinkedAccount, UUID } from "@snickerdoodlelabs/objects";

import { ENotificationTypes } from "@synamint-extension-sdk/shared/enums/notification";
import { BaseNotification } from "@synamint-extension-sdk/shared/objects/notifications/BaseNotification";

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
