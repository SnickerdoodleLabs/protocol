import {
  EBackupPriority,
  ERecordKey,
  VersionedObject,
  VersionedObjectMigrator,
} from "@snickerdoodlelabs/objects";

import { IStorageIndex } from "@persistence/IStorageIndex.js";

export class VolatileTableIndex<T extends VersionedObject>
  implements IStorageIndex
{
  public static DEFAULT_KEY = "id";
  public constructor(
    public name: ERecordKey,
    public keyPath: string | string[],
    public autoIncrement: boolean = false,
    public migrator: VersionedObjectMigrator<T>,
    public priority: EBackupPriority,
    public backupInterval: number,
    public indexBy?: [string | string[], boolean][],
  ) {}
}
