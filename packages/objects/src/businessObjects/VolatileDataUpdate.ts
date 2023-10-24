import { VersionedObject } from "@objects/businessObjects/versioned/index.js";
import { EDataUpdateOpCode } from "@objects/enum/index.js";
import {
  UnixTimestamp,
  VolatileStorageKey,
} from "@objects/primitives/index.js";

export class VolatileDataUpdate {
  public constructor(
    public operation: EDataUpdateOpCode,
    public key: VolatileStorageKey,
    public timestamp: UnixTimestamp,
    public value: VersionedObject,
    public version: number,
  ) {}
}
