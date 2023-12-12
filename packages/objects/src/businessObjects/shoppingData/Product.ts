import { VersionedObject } from "@objects/businessObjects/versioned/VersionedObject.js";
import {
  URLString,
  UnixTimestamp,
  ProductKeyword,
} from "@objects/primitives/index.js";
export class Product extends VersionedObject {
  public static CURRENT_VERSION = 1;
  /**
   * Brands in later cycles
   */
  constructor(
    readonly id: string,
    readonly name: string,
    readonly brand: string,
    readonly price: number,
    readonly description: string,
    readonly image: URLString,
    readonly url: string,
    readonly category: string,
    readonly keywords: ProductKeyword[],
    readonly dateCreated: UnixTimestamp,
  ) {
    super();
  }
  public getVersion(): number {
    return Product.CURRENT_VERSION;
  }
}