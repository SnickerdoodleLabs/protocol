import { PurchaseUtils } from "@shopping-data/implementations";
import { IPurchaseUtils } from "@shopping-data/interfaces";

class mocks {
  public factory(): IPurchaseUtils {
    return new PurchaseUtils();
  }
}

describe("PurchaseUtils", () => {});
