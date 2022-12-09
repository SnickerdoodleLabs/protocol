import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";
import { ERewardType } from "@objects/enum";
import {
  ChainId,
  EVMAccountAddress,
  IpfsCID,
  RewardFunctionParam,
  URLString,
} from "@objects/primitives";


export class LazyReward extends EarnedReward {
  constructor(
    readonly queryCID: IpfsCID,
    readonly name: string,
    readonly image: IpfsCID | URLString | null,
    readonly description: string,
    readonly chainId: ChainId,
    readonly eoa: EVMAccountAddress,
    readonly functionName: string,
    readonly functionParams: RewardFunctionParam[],
  ) {
    super(queryCID, name, image, description, ERewardType.Lazy);
  }
}
