import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_Ad } from "@query-parser/interfaces/objects/AST_Ad.js";
import { AST_Insight } from "@query-parser/interfaces/objects/AST_Insight.js";
import { Command_IF } from "@query-parser/interfaces/objects/Command_IF.js";
import { Operator } from "@query-parser/interfaces/objects/Operator.js";

export class AST_RequiresExpr {
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
      | AST_Ad
      | AST_Insight
      | Operator
      | boolean
      | number
      | string
      | null,
  ) {}
}
