import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_Ad } from "@query-parser/interfaces/objects/AST_Ad.js";
import { AST_Insight } from "@query-parser/interfaces/objects/AST_Insight.js";
import { Command_IF } from "@query-parser/interfaces/objects/Command_IF.js";
import { Condition } from "@query-parser/interfaces/objects/condition/Condition.js";
import { AST_ConditionExpr } from "@query-parser/interfaces/objects/condition/AST_ConditionExpr.js";

export type RequiresExprSourceTypes =
  | Command_IF
  | Condition
  | AST_Ad
  | AST_Insight
  | boolean;

export class AST_RequiresExpr extends AST_ConditionExpr {
  public value: any;
  constructor(
    readonly name: SDQL_Name,
    readonly source: RequiresExprSourceTypes,
  ) {
    super(name, source);
  }
}
