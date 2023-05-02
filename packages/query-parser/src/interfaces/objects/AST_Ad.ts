import {
  AdContent,
  EAdDisplayType,
  ISDQLConditionString,
  SDQL_Name,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";

import { AST_ConditionExpr } from "@query-parser/interfaces/objects/condition/AST_ConditionExpr.js";

export class AST_Ad {
  constructor(
    readonly key: SDQL_Name,
    readonly name: SDQL_Name,
    readonly content: AdContent,
    readonly text: string | null,
    readonly displayType: EAdDisplayType,
    readonly weight: number,
    readonly expiry: UnixTimestamp,
    readonly keywords: string[],
    readonly target: AST_ConditionExpr,
    readonly targetRaw: ISDQLConditionString,
  ) {}
}
