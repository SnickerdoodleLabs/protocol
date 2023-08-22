import { PurchaseHistoryPromptBuilder } from "@ai-scraper/implementations/business/utils/PurchaseHistoryPromptBuilder.js";
import {
  IPromptBuilderFactory,
  IPurchaseHistoryPromptBuilder,
} from "@ai-scraper/interfaces/index.js";

export class PromptBuilderFactory implements IPromptBuilderFactory {
  public purchaseHistory(): IPurchaseHistoryPromptBuilder {
    return new PurchaseHistoryPromptBuilder();
  }
}
