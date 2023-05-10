import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_SubQuery, Command_IF } from "@query-parser/index.js";
import { AST_Ad } from "@query-parser/interfaces/objects/AST_Ad.js";
import { AST_Expr } from "@query-parser/interfaces/objects/AST_Expr.js";
import { AST_Insight } from "@query-parser/interfaces/objects/AST_Insight.js";
import { Operator } from "@query-parser/interfaces/objects/Operator.js";

export class AST_BoolExpr extends AST_Expr {
  constructor(
    readonly name: SDQL_Name,
    readonly source:
      | Command_IF
      | AST_SubQuery
      | AST_Ad
      | AST_Insight
      | Operator
      | boolean
      | null,
  ) {
    super(name, source);
  }
}
