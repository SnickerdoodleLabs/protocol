import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { EProfileFieldType } from "@objects/extensionShared/enums/EProfileFieldType";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";

export class ProfileFieldChangedNotification extends BaseNotification<ProfileFieldUpdate> {
  constructor(public update) {
    super(ENotificationTypes.PROFILE_FIELD_CHANGED, update);
  }
}

export class ProfileFieldUpdate {
  public constructor(
    public profileField: EProfileFieldType,
    public value: any,
  ) {}
}
