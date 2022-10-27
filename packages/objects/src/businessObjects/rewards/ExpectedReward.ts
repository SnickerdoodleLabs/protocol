import { IpfsCID, URLString } from "@objects/primitives";
import { ERewardType } from "@objects/enum";

/* Must match returning EligibleReward exactly */
export class ExpectedReward {
  public constructor(
    public description: string, 
    public callback: URLString,
    public type: ERewardType
  ) {}
}