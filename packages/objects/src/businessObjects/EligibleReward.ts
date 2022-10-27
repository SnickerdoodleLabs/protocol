import { ERewardType } from "@objects/enum";
import { IpfsCID, URLString } from "@objects/primitives";

export class EligibleReward {
  public constructor(
    public description: string,
    public callback: URLString,
    public type: ERewardType,
  ) {}
}
