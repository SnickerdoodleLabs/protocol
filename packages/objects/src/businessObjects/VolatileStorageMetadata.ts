import { VersionedObject } from "@objects/businessObjects/VersionedObject";
import { EBackupPriority } from "@objects/enum/EBackupPriority";

export const VolatileStorageDataKey = "data";
export const VolatileStorageMetadataIndexes: [string, boolean][] = [
  ["deleted", false],
];

export enum EBoolean {
  FALSE = 0,
  TRUE = 1,
}

export class VolatileStorageMetadata<T extends VersionedObject> {
  public constructor(
    public data: T,
    public lastUpdate: number = Date.now(),
    public deleted: EBoolean = EBoolean.FALSE,
  ) {}
}
