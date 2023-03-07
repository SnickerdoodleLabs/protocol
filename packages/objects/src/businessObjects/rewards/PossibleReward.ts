import { QueryTypes } from "@objects/primitives";
import { ERewardType, IpfsCID } from "@snickerdoodlelabs/objects";

export class PossibleReward {
  constructor(
    readonly queryCID: IpfsCID,
    readonly queryDependencies: QueryTypes[],
    readonly name: string,
    readonly image: IpfsCID | null,
    readonly description: string,
    readonly type: ERewardType,
  ) {}
}
