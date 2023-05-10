import {
  ISDQLConditionString,
  ISDQLExpressionString,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";

import { AST_ConditionExpr } from "@query-parser/interfaces/objects/condition/AST_ConditionExpr.js";
import { AST_ReturnsExpr } from "@query-parser/interfaces/objects/AST_ReturnsExpr.js";

export class AST_Insight {
  constructor(
    readonly name: SDQL_Name,
    readonly target: AST_ConditionExpr,
    readonly targetRaw: ISDQLConditionString,
    readonly returns: AST_ReturnsExpr,
    readonly returnsRaw: ISDQLExpressionString,
  ) {}
}
