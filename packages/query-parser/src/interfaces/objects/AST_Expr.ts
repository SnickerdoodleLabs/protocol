import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_Query } from "@query-parser/interfaces/objects/AST_Query.js";
import { AST_Return } from "@query-parser/interfaces/objects/AST_Return.js";
import { Command_IF } from "@query-parser/interfaces/objects/Command_IF.js";
import { Operator } from "@query-parser/interfaces/objects/Operator.js";

export class AST_Expr {
  /**
   * Evaluates to a value.
   * @remarks
   * This is the base class for all the expressions that resolves to a value including queries
   */
  public value: any;
  constructor(
    readonly name: SDQL_Name,
    readonly source:
      | Command_IF
      | AST_Query
      | AST_Return
      | Operator
      | boolean
      | number
      | string
      | null
  ) {}
}
