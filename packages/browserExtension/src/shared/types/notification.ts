import { AccountAddedNotification } from "@shared/objects/notifications/AccountAddedNotification";
import { AccountInitializedNotification } from "@shared/objects/notifications/AccountInitializedNotification";
import { AccountRemovedNotification } from "@shared/objects/notifications/AccountRemovedNotification";

export type TNotification =
  | AccountAddedNotification
  | AccountInitializedNotification
  | AccountRemovedNotification;
