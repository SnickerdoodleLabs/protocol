import { VersionedObject } from "@objects/businessObjects/VersionedObject";
import { UnixTimestamp } from "@objects/primitives/index.js";

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
    public lastUpdate: UnixTimestamp,
    public deleted: EBoolean = EBoolean.FALSE,
  ) {}
}
