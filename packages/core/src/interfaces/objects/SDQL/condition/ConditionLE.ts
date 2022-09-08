import { SDQL_OperatorName } from "@snickerdoodlelabs/objects";

import { AST_Expr } from "@core/interfaces/objects/SDQL/index.js";

import { Condition } from "./Condition.js";

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
