import {
  ERecordKey,
  VersionedObject,
  VersionedObjectMigrator,
} from "@snickerdoodlelabs/objects";

export class VolatileTableIndex<T extends VersionedObject> {
  public static DEFAULT_KEY = "id";
  public constructor(
    public name: ERecordKey,
    public keyPath: string | string[],
    public autoIncrement: boolean = false,
    public migrator: VersionedObjectMigrator<T>,
    public indexBy?: [string | string[], boolean][],
    public disableBackup: boolean = false,
  ) {}
}
