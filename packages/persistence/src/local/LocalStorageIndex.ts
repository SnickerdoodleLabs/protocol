import { EBackupPriority, EFieldKey } from "@snickerdoodlelabs/objects";

export class LocalStorageIndex {
  public constructor(
    public key: EFieldKey,
    public priority: EBackupPriority,
    public backupInterval: number,
  ) {}
}
