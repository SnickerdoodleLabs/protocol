import { AST_Expr } from "@query-parser/interfaces/objects/AST_Expr.js";
import { Command } from "@query-parser/interfaces/objects/Command.js";
import { SDQL_Name } from "@snickerdoodlelabs/objects";

export class AST_ReturnExpr extends AST_Expr {
  /**
   * Always resolves to a boolean value
   */
  constructor(
    readonly name: SDQL_Name,
    readonly source: AST_Expr | Command,
    readonly logic: string,
  ) {
    super(name, source);
  }
}
