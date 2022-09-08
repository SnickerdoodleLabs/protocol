import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_Expr } from "./AST_Expr.js";
import { AST_Query } from "./AST_Query.js";
import { Command_IF } from "./Command_IF.js";
import { Operator } from "./Operator.js";

export class AST_ParenthesisExpr extends AST_Expr {
  // we do not need this construct as the tree has the dependencies.

  constructor(
    readonly name: SDQL_Name,
    readonly source: Command_IF | AST_Query | Operator,
  ) {
    super(name, source);
  }
}
