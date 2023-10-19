import { IProductMetaPromptBuilder } from "@ai-scraper/interfaces/business/utils/IProductMetaPromptBuilder.js";
import { IPurchaseHistoryPromptBuilder } from "@ai-scraper/interfaces/business/utils/IPurchaseHistoryPromptBuilder.js";

export interface IPromptBuilderFactory {
  productMeta(): IProductMetaPromptBuilder;
  purchaseHistory(): IPurchaseHistoryPromptBuilder;
}

export const IPromptBuilderFactoryType = Symbol.for("IPromptBuilderFactory");
