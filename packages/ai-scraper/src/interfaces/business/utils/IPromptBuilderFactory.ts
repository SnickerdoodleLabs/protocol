import { IPurchaseHistoryPromptBuilder } from "@ai-scraper/interfaces/business/utils/IPurchaseHistoryPromptBuilder.js";

export interface IPromptBuilderFactory {
  purchaseHistory(): IPurchaseHistoryPromptBuilder;
}

export const IPromptBuilderFactoryType = Symbol.for("IPromptBuilderFactory");
