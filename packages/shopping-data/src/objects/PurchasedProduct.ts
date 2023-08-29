import {
  DomainName,
  URLString,
  UnixTimestamp,
  VersionedObject,
  VersionedObjectMigrator,
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
    readonly marketPlace: DomainName,
    readonly id: ProductId | null,
    readonly name: string,
    readonly brand: string | null,
    readonly price: number,
    readonly datePurchased: UnixTimestamp | null,

    readonly dateCreated: UnixTimestamp,
    readonly description: string | null,
    readonly image: URLString | null,
    readonly url: URLString | null,
    readonly category: string | null,
    readonly keywords: ProductKeyword[] | null,
  ) {
    super();
  }
  public getVersion(): number {
    return PurchasedProduct.CURRENT_VERSION;
  }
}

export class PurchasedProductMigrator extends VersionedObjectMigrator<PurchasedProduct> {
  public getCurrentVersion(): number {
    return PurchasedProduct.CURRENT_VERSION;
  }
  protected factory(data: Record<string, unknown>): PurchasedProduct {
    return new PurchasedProduct(
      DomainName(data["marketPlace"] as string),
      ProductId(data["id"] as string),
      data["name"] as string,
      data["brand"] as string,
      data["price"] as number,
      data["datePurchased"] as UnixTimestamp,

      data["dateCreated"] as UnixTimestamp,
      data["description"] as string,
      data["image"] as URLString,
      data["url"] as URLString,
      data["category"] as string,
      data["keywords"] as ProductKeyword[],
    );
  }
  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
