import { VersionedObject } from "@objects/businessObjects/versioned/index.js";
import { EDataUpdateOpCode } from "@objects/enum/index.js";
import {
  UnixTimestamp,
  VolatileStorageKey,
} from "@objects/primitives/index.js";

export class VolatileDataUpdate {
  public constructor(
    public operation: EDataUpdateOpCode,
    // auto-incremented keys can not be evaluated from the data that is why we could have a null key
    public key: VolatileStorageKey | null,
    public timestamp: UnixTimestamp,
    public value: VersionedObject,
    public version: number,
  ) {}
}
