import { CryptoUtils, ICryptoUtils } from "@snickerdoodlelabs/node-utils";

export class CryptoUtilsMocks {
  public constructor() {}

  public factoryCryptoUtils(): ICryptoUtils {
    return new CryptoUtils();
  }
}
