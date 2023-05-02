import { SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_BoolExpr } from "@query-parser/interfaces/objects/AST_BoolExpr.js";
import { Command } from "@query-parser/interfaces/objects/Command.js";

export class Command_IF extends Command {
  constructor(
    readonly name: SDQL_Name,
    readonly trueExpr: AST_BoolExpr,
    readonly falseExpr: AST_BoolExpr | null,
    readonly conditionExpr: AST_BoolExpr,
  ) {
    super(name);
  }
}
