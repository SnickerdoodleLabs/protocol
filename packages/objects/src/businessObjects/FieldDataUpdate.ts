import { SerializedObject } from "@objects/businessObjects/SerializedObject.js";
import { EFieldKey } from "@objects/enum/index.js";
import { UnixTimestamp } from "@objects/primitives/index.js";

export class FieldDataUpdate {
  public constructor(
    public key: EFieldKey,
    public value: SerializedObject,
    public timestamp: UnixTimestamp,
  ) {}
}
