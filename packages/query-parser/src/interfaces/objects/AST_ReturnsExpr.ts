import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_SubQuery } from "@query-parser/interfaces/objects/AST_SubQuery.js";
import { AST_Expr } from "@query-parser/interfaces/objects/AST_Expr.js";
import { Operator } from "@query-parser/interfaces/objects/Operator.js";

export type ReturnsExprAllowedTypes = AST_SubQuery | Operator | boolean | number | string | null;

export class AST_ReturnsExpr extends AST_Expr {
  public value: any;
  constructor(
    readonly name: SDQL_Name,
    readonly source: ReturnsExprAllowedTypes,
  ) {
    super(name, source);
  }
}
