import { ENotificationTypes } from "@synamint-extension-sdk/shared/enums/notification";

export class BaseNotification {
  constructor(public type: ENotificationTypes) {}
}
