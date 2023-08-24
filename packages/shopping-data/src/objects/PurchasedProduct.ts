import {
  URLString,
  UnixTimestamp,
  VersionedObject,
} from "@snickerdoodlelabs/objects";

import {
  ProductId,
  ProductKeyword,
} from "@shopping-data/objects/primitives/index.js";

/**
 * We will use this class for now to reduce development complexity and also store this in the persistence for now. Later we will decompose this into a Product and a Purchase
 */
export class PurchasedProduct extends VersionedObject {
  public static CURRENT_VERSION = 1;
  /**
   * Brands in later cycles
   */
  constructor(
    readonly id: ProductId | null,
    readonly name: string,
    readonly brand: string | null,
    readonly price: number,
    readonly datePurchased: UnixTimestamp | null,

    readonly dateCreated: UnixTimestamp,
    readonly description: string | null,
    readonly image: URLString | null,
    readonly url: string | null,
    readonly category: string | null,
    readonly keywords: ProductKeyword[] | null,
  ) {
    super();
  }
  public getVersion(): number {
    return PurchasedProduct.CURRENT_VERSION;
  }
}
