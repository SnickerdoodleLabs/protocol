import { InsightString, QueryIdentifier } from "@objects/primitives";

export interface IInsights {
  queries?: {
    [queryId: QueryIdentifier]: InsightString;
  };
  returns?: {
    [returnExpr: string]: InsightString;
  };
}
