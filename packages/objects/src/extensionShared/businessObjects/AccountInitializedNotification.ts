import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";
import { DataWalletAddress } from "@objects/primitives/DataWalletAddress";

export class AccountInitializedNotification extends BaseNotification<DataWalletAddress> {
  constructor(protected dataWalletAddress: DataWalletAddress) {
    super(ENotificationTypes.ACCOUNT_INITIALIZED, dataWalletAddress);
  }
}
