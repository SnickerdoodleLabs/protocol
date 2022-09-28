import { ERewardType } from "@objects/enum/ERewardType";
import { IpfsCID } from "@objects/primitives";

export class EarnedReward {
    constructor(
        readonly cid: IpfsCID,
        readonly type: ERewardType,
    ) {}
}