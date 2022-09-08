import { DataPermissions } from "@snickerdoodlelabs/objects";

import { AST_Expr } from "./AST_Expr.js";
import { Command } from "./Command.js";

export class AST_Logic {
  /**
   * logic has returns and compensations
   * returns["if($q1and$q2)then$r1else$r2"] = a executable expression
   */

  constructor(
    readonly returns: Map<string, AST_Expr | Command>,
    readonly compensations: Map<string, AST_Expr | Command>,
    readonly returnPermissions: Map<string, DataPermissions>,
    readonly compenstationPermissions: Map<string, DataPermissions>,
  ) {}

  public getReturnPermissions(expr: string): DataPermissions {
    return this.returnPermissions.get(expr)!;
  }

  public getCompensationPermissions(expr: string): DataPermissions {
    return this.compenstationPermissions.get(expr)!;
  }
}
