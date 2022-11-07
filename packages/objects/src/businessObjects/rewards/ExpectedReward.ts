import { ERewardType } from "@objects/enum";
import { ChainId } from "@objects/primitives";

/* Must match returning EligibleReward exactly */
export class ExpectedReward {
  public constructor(
    public compensationKey: string, // c3
    public description: string,
    public chainId: ChainId,
    public callback: string, // stringify the callback object
    public type: ERewardType,
  ) {}
}
