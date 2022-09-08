import { SDQL_Name, Version } from "@snickerdoodlelabs/objects";

import { AST_Compensation } from "./AST_Compensation.js";
import { AST_Logic } from "./AST_Logic.js";
import { AST_Query } from "./AST_Query.js";
import { AST_Returns } from "./AST_Returns.js";

export class AST {
 
  constructor(
    readonly version: Version,
    readonly description: string, //TODO
    readonly business: string, //TODO
    readonly queries: Map<SDQL_Name, AST_Query>,
    readonly returns: AST_Returns | null,
    readonly compensations: Map<SDQL_Name, AST_Compensation>,
    readonly logic: AST_Logic,
  ) {
  }
}
