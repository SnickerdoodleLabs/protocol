import { EarnedReward, UUID } from "@snickerdoodlelabs/objects";
import { ENotificationTypes } from "@synamint-extension-sdk/shared/enums/notification";
import { BaseNotification } from "@synamint-extension-sdk/shared/objects/notifications/BaseNotification";

export class EarnedRewardsAddedNotification extends BaseNotification {
  constructor(
    public data: {
      rewards: EarnedReward[];
    },
    public key: UUID,
  ) {
    super(ENotificationTypes.EARNED_REWARDS_ADDED);
  }
}
