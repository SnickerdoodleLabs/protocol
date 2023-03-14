import { AST_Expr } from "@query-parser/interfaces/objects/AST_Expr.js";
import { Command } from "@query-parser/interfaces/objects/Command.js";

export class AST_Logic {
  /**
   * logic has returns and compensations
   * returns["if($q1and$q2)then$r1else$r2"] = a executable expression
   */

  constructor(readonly compensations: Map<string, AST_Expr | Command>) {}
}
