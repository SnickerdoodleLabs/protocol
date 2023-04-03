import { VersionedObject } from "@objects/businessObjects/VersionedObject.js";
import { EBoolean } from "@objects/enum/index.js";
import { UnixTimestamp } from "@objects/primitives/index.js";

export const VolatileStorageDataKey = "data";
export const VolatileStorageMetadataIndexes: [string, boolean][] = [
  ["deleted", false],
];

export class VolatileStorageMetadata<T extends VersionedObject> {
  public constructor(
    public data: T,
    public lastUpdate: UnixTimestamp,
    public deleted: EBoolean = EBoolean.FALSE,
  ) {}
}
