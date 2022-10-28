import { ERewardType } from "@objects/enum";

export class EligibleReward {
  public constructor(
    public compensationKey: string,
    public description: string,
    public type: ERewardType,
  ) {}
}
