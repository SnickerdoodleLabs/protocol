import { injectable } from "inversify";

import { ProductMetaPromptBuilder } from "@ai-scraper/implementations/business/utils/ProductMetaPromptBuilder.js";
import { PurchaseHistoryPromptBuilder } from "@ai-scraper/implementations/business/utils/PurchaseHistoryPromptBuilder.js";
import {
  IProductMetaPromptBuilder,
  IPromptBuilderFactory,
  IPurchaseHistoryPromptBuilder,
} from "@ai-scraper/interfaces/index.js";

@injectable()
export class PromptBuilderFactory implements IPromptBuilderFactory {
  public productMeta(): IProductMetaPromptBuilder {
    return new ProductMetaPromptBuilder();
  }
  public purchaseHistory(): IPurchaseHistoryPromptBuilder {
    return new PurchaseHistoryPromptBuilder();
  }
}
