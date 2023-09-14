import {
  LLMError,
  DomainName,
  ELanguageCode,
  LLMAnswerStructure,
  LLMQuestion,
  LLMResponse,
  LLMRole,
} from "@snickerdoodlelabs/objects";
import { PurchasedProduct } from "@snickerdoodlelabs/shopping-data";
import { ResultAsync } from "neverthrow";

export interface ILLMPurchaseHistoryUtils {
  getRole(): LLMRole;
  getQuestion(): LLMQuestion;
  getAnswerStructure(): LLMAnswerStructure;

  parsePurchases(
    domain: DomainName,
    language: ELanguageCode,
    llmResponse: LLMResponse,
  ): ResultAsync<PurchasedProduct[], LLMError>;
}

export const ILLMPurchaseHistoryUtilsType = Symbol.for(
  "ILLMPurchaseHistoryUtils",
);
