import { ENotificationTypes } from "@shared/enums/notification";

export class BaseNotification {
  constructor(public type: ENotificationTypes) {}
}
