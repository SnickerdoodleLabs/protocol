import { EDataStorageType, StorageKey } from "@objects/enum/index.js";
import {
  BackupFileName,
  DataWalletBackupID,
} from "@objects/primitives/index.js";

export class BackupRestoreEvent {
  public constructor(
    public storageType: EDataStorageType,
    public dataType: StorageKey,
    public backupId: DataWalletBackupID,
    public name: BackupFileName,
    public totalRestored: number,
    public remainingToRestore: number,
  ) {}
}
