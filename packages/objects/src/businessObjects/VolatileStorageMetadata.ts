import { VersionedObject } from "@objects/businessObjects/VersionedObject";
import { EBackupPriority } from "@objects/enum/EBackupPriority";

export const VolatileStorageDataKey = "data";
export const VolatileStorageMetadataIndexes: [string, boolean][] = [
  ["priority", false],
  ["lastUpdate", false],
  ["deletedAt", false],
  ["version", false],
];

export class VolatileStorageMetadata<T extends VersionedObject> {
  public constructor(
    public priority: EBackupPriority,
    public data: T,
    public version: number,
    public lastUpdate: number = Date.now(),
  ) {}
}
