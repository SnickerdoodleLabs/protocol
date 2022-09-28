import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";
import { ERewardType } from "@objects/enum";
import { ChainId, EVMAccountAddress, IpfsCID, RewardFunctionParam } from "@objects/primitives";

export class LazyReward extends EarnedReward {

    constructor(
        readonly cid: IpfsCID,
        readonly chainId: ChainId,
        readonly eoa: EVMAccountAddress,
        readonly functionName: string,
        readonly functionParams: RewardFunctionParam[]

    ) {
        super(cid, ERewardType.Lazy)
    }

}