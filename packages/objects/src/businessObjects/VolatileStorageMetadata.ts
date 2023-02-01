import { EBackupPriority, VersionedObject } from "@snickerdoodlelabs/objects";

export const VolatileStorageDataKey = "data";
export const VolatileStorageMetadataIndexes: [string, boolean][] = [
  ["priority", false],
  ["lastUpdate", false],
  ["deletedAt", false],
  ["version", false],
];

export class VolatileStorageMetadata<T extends VersionedObject> {
  public static UNDELETED = -1;
  public constructor(
    public priority: EBackupPriority,
    public data: T,
    public version: number,
    public lastUpdate: number = Date.now(),
    public deletedAt: number = VolatileStorageMetadata.UNDELETED,
  ) {}
}
