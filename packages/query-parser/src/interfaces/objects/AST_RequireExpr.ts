import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_Ad } from "@query-parser/interfaces/objects/AST_Ad.js";
import { AST_Query } from "@query-parser/interfaces/objects/AST_Query.js";
import { AST_Return } from "@query-parser/interfaces/objects/AST_Return.js";
import { Command_IF } from "@query-parser/interfaces/objects/Command_IF.js";
import { Operator } from "@query-parser/interfaces/objects/Operator.js";

export class AST_RequireExpr {
  /**
   * Evaluates to a boolean value. However the evaluation is done by checking if the variables has values. Undefined variables are evaluated as false.
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
      | AST_Ad
      | Operator
      | boolean
      | number
      | string
      | null,
  ) {}
}
