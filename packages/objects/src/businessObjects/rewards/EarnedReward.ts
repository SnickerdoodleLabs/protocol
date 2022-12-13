import { ERewardType } from "@objects/enum/ERewardType";
import { IpfsCID, URLString } from "@objects/primitives";

export class EarnedReward {
  constructor(
    readonly queryCID: IpfsCID,
    readonly name: string,
    readonly image: IpfsCID | null,
    readonly description: string,
    readonly type: ERewardType,
  ) {}
}
