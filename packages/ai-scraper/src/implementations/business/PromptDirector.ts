import { PurchaseHistoryPromptBuilder } from "@ai-scraper/implementations/business/PurchaseHistoryPromptBuilder.js";
import {
  IPromptBuilder,
  IPromptDirector,
} from "@ai-scraper/interfaces/index.js";

export class PromptDirector implements IPromptDirector {
  public makePurchaseHistoryPrompt(builder: PurchaseHistoryPromptBuilder) {
    throw new Error("Method not implemented.");
  }
}
