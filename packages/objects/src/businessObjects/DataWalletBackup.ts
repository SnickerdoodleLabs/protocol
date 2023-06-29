import { AESEncryptedString } from "@objects/businessObjects/AESEncryptedString.js";
import { DataWalletBackupHeader } from "@objects/businessObjects/DataWalletBackupHeader.js";
import { FieldDataUpdate } from "@objects/businessObjects/FieldDataUpdate.js";
import { VolatileDataUpdate } from "@objects/businessObjects/VolatileDataUpdate.js";
import { DataWalletBackupID } from "@objects/primitives/index.js";

export class DataWalletBackup {
  public constructor(
    public header: DataWalletBackupHeader,
    public blob: BackupBlob | EncryptedBackupBlob,
  ) {}

  public get id(): DataWalletBackupID {
    return this.header.hash;
  }
}

export type BackupBlob = VolatileDataUpdate[] | FieldDataUpdate;
export type EncryptedBackupBlob = AESEncryptedString;
