import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@snickerdoodlelabs/objects";

export class VolatileTableIndex<T extends VersionedObject> {
  public constructor(
    public name: string,
    public keyPath: string | string[],
    public autoIncrement: boolean = false,
    public migrator: VersionedObjectMigrator<T>,
    public indexBy?: [string | string[], boolean][],
    public disableBackup: boolean = false,
  ) {}
}
