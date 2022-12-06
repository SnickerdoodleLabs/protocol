import { ERewardType } from "@objects/enum/ERewardType";
import { IpfsCID } from "@objects/primitives";
import { RewardImage } from "@objects/primitives/RewardImage";

export class EarnedReward {
  constructor(
    readonly queryCID: IpfsCID, 
    readonly type: ERewardType,
    readonly name?: string,
    readonly image?: RewardImage
  ) {}
}
