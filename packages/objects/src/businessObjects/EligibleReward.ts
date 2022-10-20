import { IpfsCID, URLString } from "@objects/primitives";
import { ERewardType } from "@snickerdoodlelabs/objects";

export class EligibleReward {
  public constructor(
    public description: string, 
    public callback: URLString,
    public type: ERewardType
  ) {}
}
