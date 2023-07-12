import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";
import { BaseNotification } from "@objects/extensionShared/businessObjects/BaseNotification";
import { ENotificationTypes } from "@objects/extensionShared/enums/notification";

export class EarnedRewardsAddedNotification extends BaseNotification<
  EarnedReward[]
> {
  constructor(protected rewards: EarnedReward[]) {
    super(ENotificationTypes.EARNED_REWARDS_ADDED, rewards);
  }
}
