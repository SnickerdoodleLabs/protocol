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
    readonly estimatedQueryDependencies: QueryTypes[], // never use this in any business logic, because it is largely incorrect. Use this in SPA to hint at which queries the user should be giving permission to. This is only for form factors.
    readonly name: string,
    readonly image: IpfsCID | URLString | null,
    readonly description: string,
    readonly chainId: ChainId,
    readonly type: ERewardType,
  ) {}
}
