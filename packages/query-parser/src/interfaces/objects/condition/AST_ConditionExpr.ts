import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_BoolExpr } from "@query-parser/interfaces/objects/AST_BoolExpr.js";
import { AST_Subquery } from "@query-parser/interfaces/objects/AST_Subquery.js";
import { Condition } from "@query-parser/interfaces/objects/condition/Condition.js";

export class AST_ConditionExpr extends AST_BoolExpr {
  constructor(
    readonly name: SDQL_Name,
    readonly source: Condition | AST_Subquery | boolean,
  ) {
    super(name, source);
  }
}
