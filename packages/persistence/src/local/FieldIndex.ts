import { EBackupPriority, EFieldKey } from "@snickerdoodlelabs/objects";

import { IStorageIndex } from "@persistence/IStorageIndex.js";

export class FieldIndex implements IStorageIndex {
  public constructor(
    public name: EFieldKey,
    public priority: EBackupPriority,
    public backupInterval: number,
  ) {}
}
