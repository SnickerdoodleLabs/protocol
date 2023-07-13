import { DataWalletAddress, UUID } from "@snickerdoodlelabs/objects";

import { ENotificationTypes } from "@synamint-extension-sdk/shared/enums/notification";
import { BaseNotification } from "@synamint-extension-sdk/shared/objects/notifications/BaseNotification";

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
