import { ELanguageCode, NLPError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { PurchasedProduct } from "@shopping-data/objects/PurchasedProduct.js";

export interface IPurchaseUtils {
  /**
   * Returns the purchase if the purchases array contains a purchase with the same marketplace, date of purchase, name and price as the purchase parameter.
   * @param purchases
   * @param purchase
   */
  findSame(
    purchases: PurchasedProduct[],
    purchase: PurchasedProduct,
  ): ResultAsync<PurchasedProduct | null, never>;

  /**
   * Returns the purchase if the purchases array contains a purchase with the similar name and price as the purchase parameter.
   * @param purchasesWithSameMPAndDate
   * @param purchase
   */
  findSameWithSimilarNameAndPrice(
    purchasesWithSameMPAndDate: PurchasedProduct[],
    purchase: PurchasedProduct,
  ): ResultAsync<PurchasedProduct | null, never>;

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