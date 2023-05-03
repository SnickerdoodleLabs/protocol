import { InsightString, SubQueryKey } from "@objects/primitives";

export interface IInsightsQueries {
  [queryId: SubQueryKey]: InsightString | null;
}

export interface IInsightsReturns {
  [returnExpr: string]: InsightString | null;
}
export interface IInsights {
  queries: IInsightsQueries;
  returns?: IInsightsReturns;
}
