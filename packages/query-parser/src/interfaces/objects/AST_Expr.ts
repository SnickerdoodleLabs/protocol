import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_Ad } from "@query-parser/interfaces/objects/AST_Ad.js";
import { AST_Insight } from "@query-parser/interfaces/objects/AST_Insight.js";
import { AST_Subquery } from "@query-parser/interfaces/objects/AST_Subquery.js";
import { Command_IF } from "@query-parser/interfaces/objects/Command_IF.js";
import { Operator } from "@query-parser/interfaces/objects/Operator.js";

export class AST_Expr {
  public value: any;
  constructor(
    readonly name: SDQL_Name,
    readonly source:
      | Command_IF
      | AST_Subquery
      | AST_Ad
      | AST_Insight
      | Operator
      | boolean
      | number
      | string
      | null,
  ) {}
}
