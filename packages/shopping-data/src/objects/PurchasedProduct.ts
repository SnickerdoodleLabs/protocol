import {
  URLString,
  UnixTimestamp,
  VersionedObject,
} from "@snickerdoodlelabs/objects";

import { ProductKeyword } from "@shopping-data/objects/primitives/index.js";

/**
 * We will use this class for now to reduce development complexity
 */
export class PurchasedProduct extends VersionedObject {
  public static CURRENT_VERSION = 1;
  /**
   * Brands in later cycles
   */
  constructor(
    readonly id: string,
    readonly name: string,
    readonly brand: string | null,
    readonly price: number | null,
    readonly description: string | null,
    readonly image: URLString | null,
    readonly url: string | null,
    readonly category: string | null,
    readonly keywords: ProductKeyword[] | null,
    readonly dateCreated: UnixTimestamp,
    readonly datePurchased: UnixTimestamp,
  ) {
    super();
  }
  public getVersion(): number {
    return PurchasedProduct.CURRENT_VERSION;
  }
}
