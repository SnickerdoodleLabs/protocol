import { InsightString, SubqueryKey } from "@objects/primitives";

export interface IInsightsQueries {
  [queryId: SubqueryKey]: InsightString | null;
}

export interface IInsightsReturns {
  [returnExpr: string]: InsightString | null;
}
export interface IInsights {
  queries: IInsightsQueries;
  returns?: IInsightsReturns;
}
