import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_ReturnExpr } from "./AST_ReturnExpr.js";
import { Command } from "./Command.js";

import { AST_ConditionExpr } from "@core/interfaces/objects/SDQL/condition/index.js";

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
