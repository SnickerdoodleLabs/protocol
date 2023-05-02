import {
  ChainId,
  CompensationId,
  ISDQLCallback,
  ISDQLConditionString,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";

import { AST_ConditionExpr } from "@query-parser/interfaces/index.js";

export class AST_Compensation {
  constructor(
    readonly name: SDQL_Name,
    readonly description: string,
    readonly requires: AST_ConditionExpr,
    readonly requiresRaw: ISDQLConditionString,
    readonly chainId: ChainId,
    readonly callback: ISDQLCallback,
    readonly alternatives: CompensationId[],
  ) {}
}
