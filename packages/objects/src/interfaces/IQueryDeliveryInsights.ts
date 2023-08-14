import { IInsightWithProof } from "@objects/interfaces/IInsightWithProof.js";

export interface IQueryDeliveryInsights {
  [insightKey: string]: IInsightWithProof | null;
}
