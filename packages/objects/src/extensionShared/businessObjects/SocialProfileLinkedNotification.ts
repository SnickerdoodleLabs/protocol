import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";
import { SocialProfileLinkedEvent } from "@objects/businessObjects/events/social/SocialProfileLinkedEvent";

export class SocialProfileLinkedNotification extends BaseNotification {
  constructor(public data: SocialProfileLinkedEvent) {
    super(ENotificationTypes.SOCIAL_PROFILE_LINKED);
  }
}
