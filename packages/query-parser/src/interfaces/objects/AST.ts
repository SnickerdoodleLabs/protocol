import {
  ISDQLCompensationParameters,
  SDQL_Name,
  Version,
} from "@snickerdoodlelabs/objects";

import {
  AST_Ad,
  AST_Compensation,
  AST_Insight,
  AST_Subquery,
} from "@query-parser/interfaces";

export class AST {
  constructor(
    readonly version: Version,
    readonly description: string,
    readonly business: string,
    readonly ads: Map<SDQL_Name, AST_Ad>,
    readonly subqueries: Map<SDQL_Name, AST_Subquery>,
    readonly insights: Map<SDQL_Name, AST_Insight>,
    readonly compensationParameters: ISDQLCompensationParameters | null,
    readonly compensations: Map<SDQL_Name, AST_Compensation>,
  ) {}
}
