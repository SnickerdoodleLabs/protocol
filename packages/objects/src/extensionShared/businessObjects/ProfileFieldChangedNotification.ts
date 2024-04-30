import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification.js";
import { EProfileFieldType } from "@objects/extensionShared/enums/EProfileFieldType.js";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification.js";

export class ProfileFieldChangedNotification extends BaseNotification<ProfileFieldUpdate> {
  constructor(public update: ProfileFieldUpdate) {
    super(ENotificationTypes.PROFILE_FIELD_CHANGED, update);
  }
}

export class ProfileFieldUpdate {
  public constructor(
    public profileField: EProfileFieldType,
    public value: any,
  ) {}
}
