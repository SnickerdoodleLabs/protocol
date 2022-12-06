import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";
import { ERewardType } from "@objects/enum";
import {
  ChainId,
  EVMAccountAddress,
  IpfsCID,
  RewardFunctionParam,
} from "@objects/primitives";
import { RewardImage } from "@objects/primitives/RewardImage";

export class LazyReward extends EarnedReward {
  constructor(
    readonly queryCID: IpfsCID,
    readonly chainId: ChainId,
    readonly eoa: EVMAccountAddress,
    readonly functionName: string,
    readonly functionParams: RewardFunctionParam[],
    readonly name?: string,
    readonly image?: RewardImage
  ) {
    super(queryCID, ERewardType.Lazy, name, image);
  }
}
