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
  public lastUpdate: UnixTimestamp;

  public constructor(
    public data: T,
    lastUpdate?: UnixTimestamp,
    public deleted: EBoolean = EBoolean.FALSE,
  ) {
    // This points to a need to use a factory for these objects. We should probably
    // do the work of making this class internal to the persistence stuff.
    this.lastUpdate =
      lastUpdate != null
        ? lastUpdate
        : UnixTimestamp(Math.floor(Date.now() / 1000));
  }
}
