import { PurchasedProduct } from "@snickerdoodlelabs/shopping-data";

import {
  Exemplar,
  LLMAnswerStructure,
  LLMQuestion,
  LLMResponse,
  LLMRole,
} from "@ai-scraper/interfaces/primitives/index.js";

export interface ILLMPurchaseHistoryUtils {
  getRole(): LLMRole;
  getQuestion(): LLMQuestion;
  getAnswerStructure(): LLMAnswerStructure;

  parsePurchases(llmResponse: LLMResponse): PurchasedProduct;
}

export const ILLMPurchaseHistoryUtilsType = Symbol.for(
  "ILLMPurchaseHistoryUtils",
);
