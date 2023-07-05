import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";
import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";

export class EarnedRewardsAddedNotification extends BaseNotification {
  constructor(
    public data: {
      rewards: EarnedReward[];
    },
  ) {
    super(ENotificationTypes.EARNED_REWARDS_ADDED);
  }
}
