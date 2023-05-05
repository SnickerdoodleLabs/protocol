import { ERewardType } from "@objects/enum";
import {
  ChainId,
  CompensationKey,
  IpfsCID,
  QueryTypes,
  URLString,
} from "@objects/primitives";

export class PossibleReward {
  constructor(
    readonly queryCID: IpfsCID,
    readonly compensationKey: CompensationKey,
    readonly queryDependencies: QueryTypes[],
    readonly name: string,
    readonly image: IpfsCID | URLString | null,
    readonly description: string,
    readonly chainId: ChainId,
    readonly type: ERewardType,
  ) {}
}
