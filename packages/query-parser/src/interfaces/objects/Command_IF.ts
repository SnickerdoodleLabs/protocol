import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_Expr } from "./AST_Expr";

import { Command } from "@query-parser/interfaces/objects/Command.js";

export class Command_IF extends Command {
  constructor(
    readonly name: SDQL_Name,
    readonly trueExpr: AST_Expr,
    readonly falseExpr: AST_Expr | null,
    readonly conditionExpr: AST_Expr,
  ) {
    super(name);
  }
}
