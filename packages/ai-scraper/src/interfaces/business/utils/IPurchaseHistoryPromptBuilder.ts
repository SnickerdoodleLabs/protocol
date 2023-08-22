import { IPromptBuilder } from "@ai-scraper/interfaces/business/utils/IPromptBuilder.js";

export interface IPurchaseHistoryPromptBuilder extends IPromptBuilder {}
export const IPurchaseHistoryPromptBuilderType = Symbol.for(
  "IPurchaseHistoryPromptBuilder",
);
