import { SDQL_OperatorName } from "@snickerdoodlelabs/objects";

import { AST_Expr } from "@query-parser/interfaces/objects/AST_Expr.js";
import { Condition } from "@query-parser/interfaces/objects/condition/Condition.js";

export class ConditionLE extends Condition {
  constructor(
    name: SDQL_OperatorName,
    readonly lval: null | number | AST_Expr,
    readonly rval: number | AST_Expr,
  ) {
    super(name);
  }
  check(): boolean {
    // TODO
    return true;
  }
}
