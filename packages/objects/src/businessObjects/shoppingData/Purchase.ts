import { VersionedObject } from "@objects/businessObjects/versioned/VersionedObject.js";
import { UnixTimestamp } from "@objects/primitives/index.js";
export class Purchase extends VersionedObject {
  public static CURRENT_VERSION = 1;
  /**
   * Brands in later cycles
   */
  public constructor(
    readonly price: number,
    readonly datePurchased: UnixTimestamp,
  ) {
    super();
  }
  public getVersion(): number {
    return Purchase.CURRENT_VERSION;
  }
}
