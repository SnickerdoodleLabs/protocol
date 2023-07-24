import { ERewardStatus } from "@objects/enum/index.js";
import { PossibleReward } from "@objects/businessObjects/rewards/PossibleReward.js";

export class PossibleRewardWithStatus {
  constructor(
    public possibleReward: PossibleReward,
    public rewardStatus: ERewardStatus,
  ) {}
}
