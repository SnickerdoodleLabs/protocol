import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";
import { ERewardType } from "@objects/enum";
import {
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
  IpfsCID,
  RewardFunctionParam,
  URLString,
} from "@objects/primitives";

export class LazyReward extends EarnedReward {
  constructor(
    readonly queryCID: IpfsCID,
    readonly name: string,
    readonly image: IpfsCID | null,
    readonly description: string,
    readonly chainId: ChainId,
    readonly contractAddress: EVMContractAddress,
    readonly recipientAddress: EVMAccountAddress,
    readonly functionName: string,
    readonly functionParams: RewardFunctionParam[],
  ) {
    super(queryCID, name, image, description, ERewardType.Lazy);
  }
}
