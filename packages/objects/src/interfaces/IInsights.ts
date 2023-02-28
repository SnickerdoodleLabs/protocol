import { InsightString, QueryIdentifier } from "@objects/primitives";

export interface IInsightsQueries {
  [queryId: QueryIdentifier]: InsightString;
}

export interface IInsightsReturns {
  [returnExpr: string]: InsightString;
}
export interface IInsights {
  queries: IInsightsQueries;
  returns?: IInsightsReturns;
}
