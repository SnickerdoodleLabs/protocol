import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";
import { EProfileFieldType } from "@objects/extensionShared/enums/EProfileFieldType";


export class ProfileFieldChangedNotification extends BaseNotification {
  constructor(
    public data: {
      profileFieldType: EProfileFieldType;
    },
  ) {
    super(ENotificationTypes.PROFILE_FIELD_CHANGED);
  }
}
