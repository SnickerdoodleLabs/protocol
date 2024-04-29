import { SocialProfileLinkedEvent } from "@objects/businessObjects/events/social/SocialProfileLinkedEvent.js";
import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification.js";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification.js";

export class SocialProfileLinkedNotification extends BaseNotification<SocialProfileLinkedEvent> {
  constructor(protected event: SocialProfileLinkedEvent) {
    super(ENotificationTypes.SOCIAL_PROFILE_LINKED, event);
  }
}
