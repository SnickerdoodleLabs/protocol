import { SDQL_OperatorName } from "@snickerdoodlelabs/objects";

import { AST_BoolExpr } from "../AST_BoolExpr";

import { Condition } from "./Condition";

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
