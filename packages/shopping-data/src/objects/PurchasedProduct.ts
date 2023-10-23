import {
  DomainName,
  ELanguageCode,
  URLString,
  UnixTimestamp,
  VersionedObject,
  VersionedObjectMigrator,
} from "@snickerdoodlelabs/objects";

import {
  PurchaseId,
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
    readonly language: ELanguageCode,
    readonly id: PurchaseId,
    readonly name: string,
    public brand: string | null,
    readonly price: number,
    public datePurchased: UnixTimestamp,

    readonly dateCreated: UnixTimestamp,
    public description: string | null,
    public image: URLString | null,
    public url: URLString | null,
    public category: string,
    public keywords: ProductKeyword[] | null,
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
      ELanguageCode[data["languageCode"] as string],
      PurchaseId(data["id"] as string),
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
