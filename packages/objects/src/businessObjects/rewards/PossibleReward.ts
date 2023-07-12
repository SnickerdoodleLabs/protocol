import { ERewardType } from "@objects/enum/index.js";
import {
  ChainId,
  CompensationId,
  IpfsCID,
  QueryTypes,
  URLString,
} from "@objects/primitives/index.js";

export class PossibleReward {
  constructor(
    readonly queryCID: IpfsCID,
    readonly compensationKey: CompensationId,
    readonly queryDependencies: QueryTypes[],
    readonly name: string,
    readonly image: IpfsCID | URLString | null,
    readonly description: string,
    readonly chainId: ChainId,
    readonly type: ERewardType,
  ) {}
}
