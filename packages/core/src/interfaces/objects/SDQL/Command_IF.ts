import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_ReturnExpr } from "./AST_ReturnExpr";
import { Command } from "./Command";
import { AST_ConditionExpr } from "./condition/AST_ConditionExpr";

export class Command_IF extends Command {
  constructor(
    readonly name: SDQL_Name,
    readonly trueExpr: AST_ReturnExpr,
    readonly falseExpr: AST_ReturnExpr | null,
    readonly conditionExpr: AST_ConditionExpr,
  ) {
    super(name);
  }
}
