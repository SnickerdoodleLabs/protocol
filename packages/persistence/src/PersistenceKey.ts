import {
  EBackupPriority,
  EDataStorageType,
  ERecordKey,
  VersionedObject,
  VersionedObjectMigrator,
} from "@snickerdoodlelabs/objects";

export class PersistenceKey<T extends VersionedObject> {
  public constructor(
    public type: EDataStorageType,
    public name: ERecordKey,
    public keyPath: string | string[],
    public autoIncrement: boolean = false,
    public migrator: VersionedObjectMigrator<T>,
    public priority: EBackupPriority,
    public backupInterval: number,
    public maxChunkSize: number,
    public indexBy?: [string | string[], boolean][],
  ) {}

  /**
   * This method is a placeholder to allow the compiler to infer the type of the VersionedObject
   */
  public _templateType(): T {
    throw new Error("This method should never be called, it's a placeholder");
  }
}
