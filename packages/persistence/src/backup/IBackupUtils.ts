import {
  DataWalletBackup,
  EVMAccountAddress,
  EVMPrivateKey,
  Signature,
  BackupBlob,
  EncryptedBackupBlob,
  DataWalletBackupID,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBackupUtils {
  verifyBackupSignature(
    backup: DataWalletBackup,
    accountAddr: EVMAccountAddress,
  ): ResultAsync<boolean, never>;

  generateBackupSignature(
    hash: string,
    timestamp: number,
    privateKey: EVMPrivateKey,
  ): ResultAsync<Signature, never>;

  getBackupHash(
    blob: BackupBlob | EncryptedBackupBlob,
  ): ResultAsync<DataWalletBackupID, never>;
}

export const IBackupUtilsType = Symbol.for("IBackupUtils");
