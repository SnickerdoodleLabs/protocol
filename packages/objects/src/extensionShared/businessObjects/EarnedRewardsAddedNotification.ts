import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward.js";
import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification.js";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification.js";

export class EarnedRewardsAddedNotification extends BaseNotification<
  EarnedReward[]
> {
  constructor(protected rewards: EarnedReward[]) {
    super(ENotificationTypes.EARNED_REWARDS_ADDED, rewards);
  }
}
