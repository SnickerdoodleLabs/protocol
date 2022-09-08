import { SDQL_OperatorName, URLString } from "@snickerdoodlelabs/objects";

import { AST_Expr } from "@core/interfaces/objects/SDQL/index.js";

import { Condition } from "./Condition.js";

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
