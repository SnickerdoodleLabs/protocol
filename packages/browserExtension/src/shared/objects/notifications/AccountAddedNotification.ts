import { ENotificationTypes } from "@shared/enums/notification";
import { BaseNotification } from "@shared/objects/notifications/BaseNotification";
import { EVMAccountAddress, UUID } from "@snickerdoodlelabs/objects";

export class AccountAddedNotification extends BaseNotification {
  constructor(
    public data: {
      accountAddress: EVMAccountAddress;
    },
    public key: UUID,
  ) {
    super(ENotificationTypes.ACCOUNT_ADDED);
  }
}
