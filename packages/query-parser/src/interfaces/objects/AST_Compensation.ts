import {
  ChainId,
  CompensationKey,
  IpfsCID,
  ISDQLCallback,
  ISDQLConditionString,
  SDQL_Name,
  URLString,
} from "@snickerdoodlelabs/objects";

import { AST_RequireExpr } from "@query-parser/interfaces/index.js";

export class AST_Compensation {
  constructor(
    readonly name: SDQL_Name,
    readonly rewardName: string,
    readonly description: string,
    readonly requires: AST_RequireExpr,
    readonly requiresRaw: ISDQLConditionString,
    readonly chainId: ChainId,
    readonly callback: ISDQLCallback,
    readonly alternatives: CompensationKey[],
    readonly image: IpfsCID | URLString,
  ) {}
}
