import { SDQL_OperatorName } from "@snickerdoodlelabs/objects";

import { AST_Expr } from "../AST_Expr";

import { Condition } from "./Condition";

export class ConditionL extends Condition {
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
