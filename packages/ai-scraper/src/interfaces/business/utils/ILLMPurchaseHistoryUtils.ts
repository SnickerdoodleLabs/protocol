import { LLMError } from "@snickerdoodlelabs/objects";
import { PurchasedProduct } from "@snickerdoodlelabs/shopping-data";
import { ResultAsync } from "neverthrow";

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

  parsePurchases(
    llmResponse: LLMResponse,
  ): ResultAsync<PurchasedProduct[], LLMError>;
}

export const ILLMPurchaseHistoryUtilsType = Symbol.for(
  "ILLMPurchaseHistoryUtils",
);
