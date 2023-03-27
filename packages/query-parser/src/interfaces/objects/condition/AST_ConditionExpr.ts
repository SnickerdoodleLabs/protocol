import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_BoolExpr } from "@query-parser/interfaces/objects/AST_BoolExpr.js";
import { AST_Query } from "@query-parser/interfaces/objects/AST_Query.js";
import { Condition } from "@query-parser/interfaces/objects/condition/Condition.js";

export class AST_ConditionExpr extends AST_BoolExpr {
  /**
   * Always resolves to a boolean value
   * We need this abstraction layer because a conditional expression can both be a query or a conditional operator
   */
  constructor(
    readonly name: SDQL_Name,
    readonly source: Condition | AST_Query | boolean,
  ) {
    super(name, source);
  }

  check(): void {
    // TODO if query, check type
  }
}
