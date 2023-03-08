import { AccountAddedNotification } from "@synamint-extension-sdk/shared/objects/notifications/AccountAddedNotification";
import { AccountInitializedNotification } from "@synamint-extension-sdk/shared/objects/notifications/AccountInitializedNotification";
import { AccountRemovedNotification } from "@synamint-extension-sdk/shared/objects/notifications/AccountRemovedNotification";

export type TNotification =
  | AccountAddedNotification
  | AccountInitializedNotification
  | AccountRemovedNotification;
