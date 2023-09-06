import { ELanguageCode } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { PurchasedProduct } from "@shopping-data/objects/PurchasedProduct.js";

export interface IPurchaseUtils {
  /**
   *
   * @param language
   * @param productName
   * @returns a hash containing first 10 non stop words stemmed and sorted alphabetically and glued together with a hypen
   */
  getProductHash(language: ELanguageCode, productName: string): string;

  /**
   * Returns true if the purchases array contains a purchase with the same marketplace, date of purchase, name and price as the purchase parameter.
   * @param purchases
   * @param purchase
   */
  contains(
    purchases: PurchasedProduct[],
    purchase: PurchasedProduct,
  ): ResultAsync<boolean, never>;
  /**
   * Returns true if the purchases array contains a purchase with the name and price as the purchase parameter.
   * @param purchasesWithSameMPAndDate
   * @param purchase
   *
   */
  containsWithSimilarNameAndPrice(
    purchasesWithSameMPAndDate: PurchasedProduct[],
    purchase: PurchasedProduct,
  ): ResultAsync<boolean, never>;
}
export const IPurchaseUtilsType = Symbol.for("IPurchaseUtils");
