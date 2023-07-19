import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { EProfileFieldType } from "@objects/extensionShared/enums/EProfileFieldType";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";

export class ProfileFieldChangedNotification extends BaseNotification<EProfileFieldType> {
  constructor(protected profileField: EProfileFieldType) {
    super(ENotificationTypes.PROFILE_FIELD_CHANGED, profileField);
  }
}
