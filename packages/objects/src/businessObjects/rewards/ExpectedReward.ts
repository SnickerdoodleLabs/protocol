import { ERewardType } from "@objects/enum";

/* Must match returning EligibleReward exactly */
export class ExpectedReward {
  public constructor(
    public compensationKey: string,
    public description: string,
    public type: ERewardType,
  ) {}
}
