import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_Expr } from "@query-parser/interfaces/objects/AST_Expr";
import { AST_Query } from "@query-parser/interfaces/objects/AST_Query";
import { AST_Return } from "@query-parser/interfaces/objects/AST_Return";

export class AST_CompensationExpr extends AST_Expr {
  /**
   * Always resolves to a boolean value
   */
  constructor(
    readonly name: SDQL_Name,
    readonly source: AST_Return | AST_Query,
  ) {
    super(name, source);
  }
}
