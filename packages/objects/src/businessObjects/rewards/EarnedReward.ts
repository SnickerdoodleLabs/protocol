import { ERewardType } from "@objects/enum/ERewardType";
import { IpfsCID } from "@objects/primitives";

export class EarnedReward {
  constructor(readonly queryCID: IpfsCID, readonly type: ERewardType) {}
}
