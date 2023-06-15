import { SerializedObject } from "@objects/businessObjects/SerializedObject.js";
import { VersionedObject } from "@objects/businessObjects/versioned/index.js";
import { EDataUpdateOpCode, EFieldKey } from "@objects/enum/index.js";
import {
  UnixTimestamp,
  VolatileStorageKey,
} from "@objects/primitives/index.js";

export type DataUpdate = VolatileDataUpdate | FieldDataUpdate;

export class VolatileDataUpdate {
  public constructor(
    public operation: EDataUpdateOpCode,
    public key: VolatileStorageKey | null,
    public timestamp: UnixTimestamp,
    public value: VersionedObject,
    public version: number,
  ) {}
}

export class FieldDataUpdate {
  public constructor(
    public key: EFieldKey,
    public value: SerializedObject,
    public timestamp: UnixTimestamp,
  ) {}
}
