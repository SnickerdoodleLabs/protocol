import { inject, injectable } from "inversify";

import {
  Exemplar,
  ILLMPurchaseHistoryUtils,
  LLMAnswerStructure,
  LLMQuestion,
  LLMRole,
} from "@ai-scraper/interfaces/index.js";

/**
 * @description We will make this updateable via ipfs in future. For now,
 * it will implement utils for all the tasks. Later we can break this into multiple classes
 */
@injectable()
export class LLMPurchaseHistoryUtilsChatGPT
  implements ILLMPurchaseHistoryUtils
{
  // public getPurchaseHistoryExemplars(): Exemplar[] {
  //   // throw new Error("Exemplars too big to be be con");
  //   return []; // no exemplars as purchase history has too many tokens
  // }
  public getRole(): LLMRole {
    return LLMRole("You are an expert in understanding e-commerce");
  }
  public getQuestion(): LLMQuestion {
    return LLMQuestion(
      "Can you get the product names from the following text? I also need the product brand, price, classification, keywords, and date purchased.",
    );
  }
  public getAnswerStructure(): LLMAnswerStructure {
    return LLMAnswerStructure(
      "Respond with the names, brand, price, classification, keywords, and date only. Please, use JSON structure for output",
    );
  }
}
