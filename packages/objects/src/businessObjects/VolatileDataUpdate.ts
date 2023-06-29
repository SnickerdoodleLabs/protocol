import { SerializedObject } from "@objects/businessObjects/SerializedObject.js";
import { VersionedObject } from "@objects/businessObjects/versioned/index.js";
import { EDataUpdateOpCode, EFieldKey } from "@objects/enum/index.js";
import {
  UnixTimestamp,
  VolatileStorageKey,
} from "@objects/primitives/index.js";

export class VolatileDataUpdate {
  public constructor(
    public operation: EDataUpdateOpCode,
    public key: VolatileStorageKey | null,
    public timestamp: UnixTimestamp,
    public value: VersionedObject,
    public version: number,
  ) {}
}
