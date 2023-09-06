import "reflect-metadata";
import { IStemmerService } from "@snickerdoodlelabs/nlp";
import * as td from "testdouble";

import { PurchaseUtils } from "@shopping-data/implementations";
import { IPurchaseUtils } from "@shopping-data/interfaces";

class Mocks {
  public stemmerService = td.object<IStemmerService>();
  public constructor() {}
  public factory(): IPurchaseUtils {
    return new PurchaseUtils(this.stemmerService);
  }
}

describe("PurchaseUtils", () => {});
