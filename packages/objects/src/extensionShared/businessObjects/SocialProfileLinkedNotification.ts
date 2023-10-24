import { SocialProfileLinkedEvent } from "@objects/businessObjects/events/social/SocialProfileLinkedEvent";
import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";

export class SocialProfileLinkedNotification extends BaseNotification<SocialProfileLinkedEvent> {
  constructor(protected event: SocialProfileLinkedEvent) {
    super(ENotificationTypes.SOCIAL_PROFILE_LINKED, event);
  }
}
