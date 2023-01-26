import { EBackupPriority } from "@snickerdoodlelabs/objects";

export const VolatileStorageDataKey = "data";
export const VolatileStorageMetadataIndexes: [string, boolean][] = [
  ["priority", false],
  ["lastUpdate", false],
  ["deletedAt", false],
];

export class VolatileStorageMetadata<T> {
  public static UNDELETED = -1;
  public constructor(
    public priority: EBackupPriority,
    public data: T,
    public lastUpdate: number = Date.now(),
    public deletedAt: number = VolatileStorageMetadata.UNDELETED,
  ) {}
}
