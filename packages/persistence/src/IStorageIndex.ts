import { EBackupPriority, StorageKey } from "@snickerdoodlelabs/objects";

export interface IStorageIndex {
  name: StorageKey;
  priority: EBackupPriority;
  backupInterval: number;
}
