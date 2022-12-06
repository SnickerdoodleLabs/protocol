import { ERewardType } from "@objects/enum/ERewardType";
import { IpfsCID } from "@objects/primitives";

export class EarnedReward {
  constructor(
    readonly name: string,
    readonly image: IpfsCID,
    readonly queryCID: IpfsCID, 
    readonly type: ERewardType
  ) {}
}
