
import { CryptoUtils } from "@common-utils/implementations";
import { ICryptoUtils } from "@common-utils/interfaces";


export class CryptoUtilsMocks {
    public constructor() {}

    public factoryCryptoUtils(): ICryptoUtils {
        return new CryptoUtils();
    }
}
