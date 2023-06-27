import { InsightString, QueryIdentifier } from "@objects/primitives";

export interface IInsightsQueries {
  [queryId: QueryIdentifier]: InsightString | null;
}

export interface IInsightsReturns {
  [returnExpr: string]: InsightString | null;
}
export interface IInsights {
  queries: IInsightsQueries;
  returns?: IInsightsReturns;
}
