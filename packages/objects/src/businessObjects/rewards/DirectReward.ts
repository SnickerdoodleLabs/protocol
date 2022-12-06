import { EarnedReward } from "@objects/businessObjects/rewards/EarnedReward";
import { ERewardType } from "@objects/enum";
import {
  ChainId,
  EVMAccountAddress,
  IpfsCID,
  TransactionReceipt,
} from "@objects/primitives";


export class DirectReward extends EarnedReward {
  constructor(
    readonly queryCID: IpfsCID,
    readonly name: string,
    readonly image: IpfsCID,
    readonly chainId: ChainId,
    readonly eoa: EVMAccountAddress,
    readonly transactionReceipt: TransactionReceipt,
  ) {
    super(queryCID, name, image, ERewardType.Direct);
  }
}
