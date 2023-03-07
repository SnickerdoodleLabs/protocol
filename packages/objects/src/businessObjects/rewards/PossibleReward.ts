import { ChainId, QueryTypes, URLString } from "@objects/primitives";
import { ERewardType, IpfsCID } from "@snickerdoodlelabs/objects";

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
