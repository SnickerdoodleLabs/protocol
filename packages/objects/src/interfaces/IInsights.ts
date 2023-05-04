import { InsightString } from "@objects/primitives";
import { SubQueryKey } from "@objects/primitives/SubQueryKey.js";

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
