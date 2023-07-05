import {
  AccountAddedNotification,
  AccountInitializedNotification,
  AccountRemovedNotification,
  EarnedRewardsAddedNotification,
  CohortJoinedNotification,
  ProfileFieldChangedNotification,
  SocialProfileLinkedNotification,
} from "@objects/extensionShared/businessObjects";

export type TNotification =
  | AccountAddedNotification
  | AccountInitializedNotification
  | AccountRemovedNotification
  | EarnedRewardsAddedNotification
  | CohortJoinedNotification
  | ProfileFieldChangedNotification
  | SocialProfileLinkedNotification;
