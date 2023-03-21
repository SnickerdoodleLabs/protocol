import {
  ChainId,
  CompensationId,
  ISDQLCallback,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";

import { AST_RequireExpr } from "@query-parser/interfaces/objects/AST_RequireExpr.js";

export class AST_Compensation {
  constructor(
    readonly name: SDQL_Name,
    readonly description: string, // TODO
    readonly requires: AST_RequireExpr,
    readonly chainId: ChainId,
    readonly callback: ISDQLCallback,
    readonly alternatives: CompensationId[],
  ) {}
}
