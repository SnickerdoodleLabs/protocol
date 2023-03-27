import { SerializedObject, VersionedObject } from "@objects/businessObjects";
import { EDataUpdateOpCode, EFieldKey } from "@objects/enum";
import { JSONString, VolatileStorageKey } from "@objects/primitives";

export type DataUpdate = VolatileDataUpdate | FieldDataUpdate;

export class VolatileDataUpdate {
  public constructor(
    public operation: EDataUpdateOpCode,
    public key: VolatileStorageKey | null,
    public timestamp: number,
    public value: VersionedObject,
    public version: number,
  ) {}
}

export class FieldDataUpdate {
  public constructor(
    public key: EFieldKey,
    public value: SerializedObject,
    public timestamp: number,
  ) {}
}
