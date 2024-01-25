import {
  EBackupPriority,
  ERecordKey,
  VersionedObject,
  VersionedObjectMigrator,
} from "@snickerdoodlelabs/objects";

import { IStorageIndex } from "@persistence/IStorageIndex.js";

/**
 * Represents the structure of a table in the volatile storage.
 * @implements {IStorageIndex}
 * @template T - The type of VersionedObject associated with the index.
 * @todo TODO: name of this class is confusing,
 */
export class VolatileTableIndex<T extends VersionedObject>
  implements IStorageIndex
{
  /**
   * Creates an instance of VolatileTableIndex.
   * @param {ERecordKey} name - The name of the object store.
   * @param {[string | string[], false] | [null, true]} primayKey - The primary key configuration.
   *   - The first item in the list is the key path.
   *   - The second item in the list is the auto-increment flag.
   *   - If auto-increment is true, the key path must be null.
   *   - If auto-increment is false, the key path must be a string or string array for compound keys.
   *   - Note: primary key configuration can not be changed after the object store is created. If you need to change it, you must create a new object store.
   * @param {VersionedObjectMigrator<T>} migrator - The migrator for versioned objects.
   * @param {EBackupPriority} priority - The backup priority.
   * @param {number} backupInterval - The interval at which backups should be performed (in milliseconds).
   * @param {number} maxChunkSize - The maximum chunk size for the data.
   * @param {[string | string[], boolean][]} [indexBy] - Object store index configurations.
   *   - Each item in the list represents an index:
   *     - The first item is the key path.
   *     - The second item is a boolean indicating whether it is unique.
   *  - Note: Any changes to the index configuration after the creation of the object store require updating the database version.
   */
  public constructor(
    public name: ERecordKey,
    public primayKey: [string | string[], false] | [null, true],
    public migrator: VersionedObjectMigrator<T>,
    public priority: EBackupPriority,
    public backupInterval: number,
    public maxChunkSize: number,
    public indexBy?: [string | string[], boolean][],
  ) {}
}
