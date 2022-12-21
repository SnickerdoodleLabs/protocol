import { ISDQLCompensationParameters, SDQL_Name, Version } from "@snickerdoodlelabs/objects";

import { AST_Compensation } from "@query-parser/interfaces/objects/AST_Compensation.js";
import { AST_Logic } from "@query-parser/interfaces/objects/AST_Logic.js";
import { AST_Query } from "@query-parser/interfaces/objects/AST_Query.js";
import { AST_Returns } from "@query-parser/interfaces/objects/AST_Returns.js";
import { AST_Ad } from "@query-parser/interfaces";


export class AST {
  constructor(
    readonly version: Version,
    readonly description: string, //TODO
    readonly business: string, //TODO
    readonly ads:  Map<SDQL_Name, AST_Ad>,
    readonly queries: Map<SDQL_Name, AST_Query>,
    readonly returns: AST_Returns | null,
    readonly compensationParameters: ISDQLCompensationParameters | null,
    readonly compensations: Map<SDQL_Name, AST_Compensation>,
    readonly logic: AST_Logic,
  ) {}
}
