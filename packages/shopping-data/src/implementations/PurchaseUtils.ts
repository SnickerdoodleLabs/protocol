import { DomainName, UnixTimestamp } from "@snickerdoodlelabs/objects";
import { ResultAsync, ok, okAsync } from "neverthrow";

import { IPurchaseUtils } from "@shopping-data/interfaces/index.js";
import { PurchasedProduct } from "@shopping-data/objects/index.js";

export class PurchaseUtils implements IPurchaseUtils {
  public contains(
    purchases: PurchasedProduct[],
    purchase: PurchasedProduct,
  ): ResultAsync<boolean, never> {
    return this.filterByMPAndDate(
      purchases,
      purchase.marketPlace,
      purchase.datePurchased,
    ).andThen((filtered) => {
      return this.containsWithSimilarNameAndPrice(filtered, purchase);
    });
  }

  public containsWithSimilarNameAndPrice(
    purchasesWithSameMPAndDate: PurchasedProduct[],
    purchase: PurchasedProduct,
  ): ResultAsync<boolean, never> {
    throw new Error("Method not implemented.");
  }

  private filterByMPAndDate(
    purchases: PurchasedProduct[],
    marketPlace: DomainName,
    datePurchased: UnixTimestamp,
  ): ResultAsync<PurchasedProduct[], never> {
    const filtered = purchases.reduce((acc, curr) => {
      if (
        curr.marketPlace == marketPlace &&
        curr.datePurchased == datePurchased
      ) {
        acc.push(curr);
      }
      return acc;
    }, [] as PurchasedProduct[]);
    return okAsync(filtered);
  }
}
