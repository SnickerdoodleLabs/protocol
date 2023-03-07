import { ERewardType } from "@objects/enum";
import { ChainId, IpfsCID, QueryTypes, URLString } from "@objects/primitives";

export class PossibleReward {
  constructor(
    readonly queryCID: IpfsCID,
    readonly queryDependencies: QueryTypes[],
    readonly name: string,
    readonly image: IpfsCID | URLString | null,
    readonly description: string,
    readonly chainId: ChainId,
    readonly callback: string,
    readonly type: ERewardType,
  ) {}
}
