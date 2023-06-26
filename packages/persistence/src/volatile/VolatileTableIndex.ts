import {
  EBackupPriority,
  ERecordKey,
  VersionedObject,
  VersionedObjectMigrator,
} from "@snickerdoodlelabs/objects";
import { ObjectClass } from "realm";

import { IStorageIndex } from "@persistence/IStorageIndex.js";

export class VolatileTableIndex<T extends VersionedObject>
  implements IStorageIndex
{
  public static DEFAULT_KEY = "primaryKey";
  public constructor(
    public name: ERecordKey,
    public realmClass: ObjectClass<any>,
    public migrator: VersionedObjectMigrator<T>,
    public priority: EBackupPriority,
    public backupInterval: number,
    public maxChunkSize: number,
    public indexBy?: [string | string[], boolean][],
    public autoIncrement: boolean = false,
  ) {}
}
