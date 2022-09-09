import { SDQL_OperatorName } from "@snickerdoodlelabs/objects";

import { AST_BoolExpr } from "@query-parser/interfaces/objects/AST_BoolExpr.js";
import { Condition } from "@query-parser/interfaces/objects/condition/Condition.js";

export class ConditionOr extends Condition {
  constructor(
    name: SDQL_OperatorName,
    readonly lval: AST_BoolExpr | boolean,
    readonly rval: AST_BoolExpr | boolean,
  ) {
    super(name);
  }

  // public result(): boolean{
  //     return (this.lval || this.rval);
  // }
  check(): boolean {
    // TODO
    return true;
  }
}
