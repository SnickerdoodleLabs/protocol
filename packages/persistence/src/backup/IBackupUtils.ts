import {
  DataWalletBackup,
  EVMAccountAddress,
  EVMPrivateKey,
  Signature,
  DataWalletBackupID,
  VolatileDataUpdate,
  FieldDataUpdate,
  AESEncryptedString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBackupUtils {
  verifyBackupSignature(
    backup: DataWalletBackup,
    accountAddr: EVMAccountAddress,
  ): ResultAsync<boolean, never>;

  generateBackupSignature(
    hash: DataWalletBackupID,
    timestamp: number,
    privateKey: EVMPrivateKey,
  ): ResultAsync<Signature, never>;

  getBackupHash(
    blob: VolatileDataUpdate[] | FieldDataUpdate | AESEncryptedString,
  ): ResultAsync<DataWalletBackupID, never>;

  encryptBlob(
    blob: VolatileDataUpdate[] | FieldDataUpdate,
    privateKey: EVMPrivateKey | null,
  ): ResultAsync<
    VolatileDataUpdate[] | FieldDataUpdate | AESEncryptedString,
    never
  >;
}

export const IBackupUtilsType = Symbol.for("IBackupUtils");
