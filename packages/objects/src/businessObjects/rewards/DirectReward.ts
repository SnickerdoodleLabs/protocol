import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";
import { ERewardType } from "@objects/enum";
import {
  ChainId,
  EVMAccountAddress,
  IpfsCID,
  TransactionReceipt,
} from "@objects/primitives";
import { RewardImage } from "@objects/primitives/RewardImage";

export class DirectReward extends EarnedReward {
  constructor(
    readonly queryCID: IpfsCID,
    readonly chainId: ChainId,
    readonly eoa: EVMAccountAddress,
    readonly transactionReceipt: TransactionReceipt,
    readonly name?: string,
    readonly image?: RewardImage
  ) {
    super(queryCID, ERewardType.Direct, name, image);
  }
}
