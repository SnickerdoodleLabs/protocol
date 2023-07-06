import { AESEncryptedString } from "@objects/businessObjects/AESEncryptedString.js";
import {
  FieldDataUpdate,
  VolatileDataUpdate,
} from "@objects/businessObjects/DataUpdate.js";
import { DataWalletBackupHeader } from "@objects/businessObjects/DataWalletBackupHeader.js";

export class DataWalletBackup {
  public constructor(
    public header: DataWalletBackupHeader,
    public blob: BackupBlob | EncryptedBackupBlob,
  ) {}
}

export type BackupBlob = VolatileDataUpdate[] | FieldDataUpdate;
export type EncryptedBackupBlob = AESEncryptedString;
