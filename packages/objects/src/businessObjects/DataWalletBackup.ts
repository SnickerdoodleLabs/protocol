import {
  AESEncryptedString,
  DataWalletBackupHeader,
  FieldDataUpdate,
  VersionedObject,
  VolatileDataUpdate,
} from "@objects/businessObjects";

export class DataWalletBackup {
  public constructor(
    public header: DataWalletBackupHeader,
    public blob: BackupBlob | EncryptedBackupBlob,
  ) {}
}

export type BackupBlob = VolatileDataUpdate[] | FieldDataUpdate;
export type EncryptedBackupBlob = AESEncryptedString;
