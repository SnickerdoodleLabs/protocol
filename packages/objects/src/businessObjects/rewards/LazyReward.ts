import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";
import { ERewardType } from "@objects/enum";
import {
  ChainId,
  EVMAccountAddress,
  IpfsCID,
  RewardFunctionParam,
} from "@objects/primitives";


export class LazyReward extends EarnedReward {
  constructor(
    readonly name: string,
    readonly image: IpfsCID,
    readonly queryCID: IpfsCID,
    readonly chainId: ChainId,
    readonly eoa: EVMAccountAddress,
    readonly functionName: string,
    readonly functionParams: RewardFunctionParam[],
  ) {
    super(name, image, queryCID, ERewardType.Lazy);
  }
}
