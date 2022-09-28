import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";
import { ERewardType } from "@objects/enum";
import { ChainId, EVMAccountAddress, IpfsCID, TransactionReceipt } from "@objects/primitives";

export class DirectReward extends EarnedReward {

    constructor(
        readonly cid: IpfsCID,
        readonly chainId: ChainId,
        readonly eoa: EVMAccountAddress,
        readonly transactionReceipt: TransactionReceipt

    ) {
        super(cid, ERewardType.Direct)
    }

}