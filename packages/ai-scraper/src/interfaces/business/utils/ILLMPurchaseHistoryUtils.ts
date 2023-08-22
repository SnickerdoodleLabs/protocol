import {
  Exemplar,
  LLMAnswerStructure,
  LLMQuestion,
  LLMRole,
} from "@ai-scraper/interfaces/primitives/index.js";

export interface ILLMPurchaseHistoryUtils {
  getRole(): LLMRole;
  getQuestion(): LLMQuestion;
  getAnswerStructure(): LLMAnswerStructure;
}

export const ILLMPurchaseHistoryUtilsType = Symbol.for(
  "ILLMPurchaseHistoryUtils",
);
