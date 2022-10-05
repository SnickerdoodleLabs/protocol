import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_Expr } from "@query-parser/interfaces/objects/AST_Expr.js";
import { AST_Query } from "@query-parser/interfaces/objects/AST_Query.js";
import { Operator } from "@query-parser/interfaces/objects/Operator.js";

export class AST_BoolExpr extends AST_Expr {
  /**
   * Always resolves to a boolean value
   */
  constructor(readonly name: SDQL_Name, readonly source: AST_Query | Operator) {
    super(name, source);
    this.check();
  }

  check(): void {
    // TODO:
    // throw new TypeError("Expected boolean return type")
  }
}
