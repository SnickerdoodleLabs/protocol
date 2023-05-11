import { InsightString } from "@objects/primitives/InsightString.js";

export interface IQueryDeliveryInsights {
  [insightKey: string]: InsightString | null;
}
