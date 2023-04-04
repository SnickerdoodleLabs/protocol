import { VersionedObject } from "@objects/businessObjects/VersionedObject";
import { EBoolean } from "@objects/enum";

export const VolatileStorageDataKey = "data";
export const VolatileStorageMetadataIndexes: [string, boolean][] = [
  ["deleted", false],
];

export class VolatileStorageMetadata<T extends VersionedObject> {
  public constructor(
    public data: T,
    public lastUpdate: number = Date.now(),
    public deleted: EBoolean = EBoolean.FALSE,
  ) {}
}
