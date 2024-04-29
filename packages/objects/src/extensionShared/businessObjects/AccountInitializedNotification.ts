import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification.js";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification.js";
import { DataWalletAddress } from "@objects/primitives/DataWalletAddress.js";

export class AccountInitializedNotification extends BaseNotification<DataWalletAddress> {
  constructor(protected dataWalletAddress: DataWalletAddress) {
    super(ENotificationTypes.WALLET_INITIALIZED, dataWalletAddress);
  }
}
