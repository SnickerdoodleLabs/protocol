import { AESKey, EVMPrivateKey, Signature } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDataWalletUtils {
  createDataWalletKey(): ResultAsync<EVMPrivateKey, never>;
  deriveEncryptionKeyFromSignature(
    signature: Signature,
  ): ResultAsync<AESKey, never>;
}

export const IDataWalletUtilsType = Symbol.for("IDataWalletUtils");
