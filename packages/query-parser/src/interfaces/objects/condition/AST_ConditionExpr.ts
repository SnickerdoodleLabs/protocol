import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { Condition } from "./Condition.js";

import {
  AST_BoolExpr,
} from "@core/interfaces/objects/SDQL/AST_BoolExpr.js";
import {
  AST_Query,
} from "@core/interfaces/objects/SDQL/AST_Query.js";

export class AST_ConditionExpr extends AST_BoolExpr {
  /**
   * Always resolves to a boolean value
   * We need this abstraction layer because a conditional expression can both be a query or a conditional operator
   */
  constructor(
    readonly name: SDQL_Name,
    readonly source: Condition | AST_Query,
  ) {
    super(name, source);
  }

  check(): void {
    // TODO if query, check type
  }
}
