import { ILLMPurchaseHistoryUtils } from "@ai-scraper/interfaces/business/utils/ILLMPurchaseHistoryUtils.js";

/**
 * Currently we don't need it. But in future if we want a fallback LLM provider for this task, we will need it
 */
export interface ILLMPurchaseHistoryUtilsChatGPT
  extends ILLMPurchaseHistoryUtils {}

export const ILLMPurchaseHistoryUtilsChatGPTType = Symbol.for(
  "ILLMPurchaseHistoryUtilsChatGPT",
);
