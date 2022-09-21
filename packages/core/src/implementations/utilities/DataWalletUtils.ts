import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  EVMPrivateKey,
  Signature,
  AESKey,
  HexString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IDataWalletUtils } from "@core/interfaces/utilities/index.js";

@injectable()
export class DataWalletUtils implements IDataWalletUtils {
  public constructor(
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
  ) {}

  public createDataWalletKey(): ResultAsync<EVMPrivateKey, never> {
    return this.cryptoUtils.createEthereumPrivateKey();
  }

  public deriveEncryptionKeyFromSignature(
    signature: Signature,
  ): ResultAsync<AESKey, never> {
    // The only hard thing here is the salt. I am just using a constant value for now.
    // TODO: Figure out if there is a better salt we can use
    return this.cryptoUtils.deriveAESKeyFromSignature(
      signature,
      HexString("0x0"),
    );
  }
}
