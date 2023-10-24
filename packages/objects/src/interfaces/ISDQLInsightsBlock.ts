import { ISDQLInsightBlock } from "@objects/interfaces/ISDQLInsightBlock.js";

export interface ISDQLInsightsBlock {
  [insightId: string]: ISDQLInsightBlock;
}
