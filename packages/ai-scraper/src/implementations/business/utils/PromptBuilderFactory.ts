import { injectable } from "inversify";

import { PurchaseHistoryPromptBuilder } from "@ai-scraper/implementations/business/utils/PurchaseHistoryPromptBuilder.js";
import {
  IPromptBuilderFactory,
  IPurchaseHistoryPromptBuilder,
} from "@ai-scraper/interfaces/index.js";

@injectable()
export class PromptBuilderFactory implements IPromptBuilderFactory {
  public purchaseHistory(): IPurchaseHistoryPromptBuilder {
    return new PurchaseHistoryPromptBuilder();
  }
}
