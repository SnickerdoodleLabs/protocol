import { ChainId } from "..";

import { ERewardType } from "@objects/enum";
import { RewardImage } from "@objects/primitives/RewardImage";

export class EligibleReward {
  public constructor(
    public compensationKey: string, // c3
    public description: string,
    public chainId: ChainId,
    public callback: string, // stringify the callback object
    public type: ERewardType,
    public name?: string,
    public image?: RewardImage
  ) {}
}
