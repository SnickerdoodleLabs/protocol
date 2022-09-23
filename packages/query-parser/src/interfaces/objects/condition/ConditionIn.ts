import { SDQL_OperatorName, URLString } from "@snickerdoodlelabs/objects";

import { AST_Expr } from "@query-parser/interfaces/objects/AST_Expr.js";
import { Condition } from "@query-parser/interfaces/objects/condition/Condition.js";

export class ConditionIn extends Condition {
  constructor(
    name: SDQL_OperatorName,
    readonly lval: null | number | string | URLString | AST_Expr,
    readonly rvals: Array<number | string | URLString | AST_Expr>,
  ) {
    super(name);
  }

  check(): boolean {
    // TODO
    return true;
  }
}
