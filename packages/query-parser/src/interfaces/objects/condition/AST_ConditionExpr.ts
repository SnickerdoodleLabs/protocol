import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_SubQuery } from "@query-parser/index.js";
import { AST_BoolExpr } from "@query-parser/interfaces/objects/AST_BoolExpr.js";
import { Condition } from "@query-parser/interfaces/objects/condition/Condition.js";
import { AST_Ad } from "@query-parser/interfaces/objects/AST_Ad.js";
import { AST_Insight } from "@query-parser/interfaces/objects/AST_Insight.js";
import { Command_IF } from "@query-parser/interfaces/objects/Command_IF.js";

export type ConditionExprSourceTypes =
  | Command_IF
  | Condition
  | AST_SubQuery
  | AST_Ad
  | AST_Insight
  | Condition
  | boolean;

export class AST_ConditionExpr extends AST_BoolExpr {
  constructor(
    readonly name: SDQL_Name,
    readonly source: ConditionExprSourceTypes,
  ) {
    super(name, source);
  }
}
