import {
  AccountAddedNotification,
  AccountInitializedNotification,
  AccountRemovedNotification,
  EarnedRewardsAddedNotification,
} from "@synamint-extension-sdk/shared/objects/notifications";

export type TNotification =
  | AccountAddedNotification
  | AccountInitializedNotification
  | AccountRemovedNotification
  | EarnedRewardsAddedNotification;
