import {
  ISDQLConditionString,
  ISDQLExpressionString,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";

import { AST_Expr } from "@query-parser/interfaces/objects/AST_Expr.js";
import { AST_ConditionExpr } from "@query-parser/interfaces/objects/condition/AST_ConditionExpr.js";

export class AST_Insight {
  constructor(
    readonly name: SDQL_Name,
    readonly target: AST_ConditionExpr,
    readonly targetRaw: ISDQLConditionString,
    readonly returns: AST_Expr,
    readonly returnsRaw: ISDQLExpressionString,
  ) {}
}
