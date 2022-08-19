import { ENotificationTypes } from "@shared/enums/notification";
import { BaseNotification } from "@shared/objects/notifications/BaseNotification";
import { DataWalletAddress, UUID } from "@snickerdoodlelabs/objects";

export class AccountInitializedNotification extends BaseNotification {
  constructor(
    public data: {
      dataWalletAddress: DataWalletAddress;
    },
    public key: UUID,
  ) {
    super(ENotificationTypes.ACCOUNT_INITIALIZED);
  }
}
