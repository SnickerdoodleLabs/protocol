import {
  ISDQLCompensationParameters,
  SDQL_Name,
  UnixTimestamp,
  Version,
} from "@snickerdoodlelabs/objects";

import {
  AST_Ad,
  AST_Compensation,
  AST_Insight,
  AST_Question,
} from "@query-parser/interfaces/index.js";
import { AST_SubQuery } from "@query-parser/interfaces/objects/AST_SubQuery.js";

export class AST {
  constructor(
    readonly version: Version,
    readonly description: string,
    readonly business: string,
    readonly ads: Map<SDQL_Name, AST_Ad>,
    readonly subqueries: Map<SDQL_Name, AST_SubQuery>,
    readonly insights: Map<SDQL_Name, AST_Insight>,
    readonly compensationParameters: ISDQLCompensationParameters | null,
    readonly compensations: Map<SDQL_Name, AST_Compensation>,
    readonly questions: AST_Question[],
    readonly queryTimestamp: UnixTimestamp,
  ) {}
}
