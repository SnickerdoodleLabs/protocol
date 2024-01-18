import { PurchasedProduct } from "@snickerdoodlelabs/objects";
import { ResultAsync, okAsync } from "neverthrow";

import { ILLMPurchaseValidator } from "@ai-scraper/interfaces/utils/ILLMPurchaseValidator.js";

export class LLMPurchaseValidator implements ILLMPurchaseValidator {
  public trimHalucinatedPurchases(
    promptText: string,
    purchases: PurchasedProduct[],
  ): ResultAsync<PurchasedProduct[], never> {
    const validPurchases = purchases.reduce((acc, purchase) => {
      // we cannot add price here as multiple order pricing can be hacked a bit
      if (promptText.includes(purchase.name)) {
        return [...acc, purchase];
      }
      return acc;
    }, [] as PurchasedProduct[]);

    return okAsync(validPurchases);
  }
}
