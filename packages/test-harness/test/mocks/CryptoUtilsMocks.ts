
import { CryptoUtils, ICryptoUtils } from "@snickerdoodlelabs/common-utils";


export class CryptoUtilsMocks {
    public constructor() {}

    public factoryCryptoUtils(): ICryptoUtils {
        return new CryptoUtils();
    }
}
