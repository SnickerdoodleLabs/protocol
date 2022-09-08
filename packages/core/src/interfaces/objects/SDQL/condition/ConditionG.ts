import { SDQL_OperatorName } from "@snickerdoodlelabs/objects";

import { Condition } from "./Condition.js";

import { AST_Expr } from "@core/interfaces/objects/SDQL/index.js";

export class ConditionG extends Condition {
  constructor(
    name: SDQL_OperatorName, // ge - greater and equal then
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
