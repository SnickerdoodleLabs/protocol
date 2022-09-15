import { SDQL_OperatorName, SDQL_Return } from "@snickerdoodlelabs/objects";

import { AST_BoolExpr } from "@query-parser/interfaces/objects/AST_BoolExpr";

import { Condition } from "@query-parser/interfaces/objects/condition/Condition";

export class ConditionAnd extends Condition {
  constructor(
    name: SDQL_OperatorName, // and
    readonly lval: AST_BoolExpr | boolean | SDQL_Return,
    readonly rval: AST_BoolExpr | boolean | SDQL_Return,
  ) {
    super(name);
  }

  // results will be computed by the AST evaluator
  // public result(): boolean{
  //     return (this.lval && this.rval);
  // }

  check(): boolean {
    // TODO
    return true;
  }
}
