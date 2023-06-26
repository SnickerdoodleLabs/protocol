import { VolatileStorageKey } from "@objects/primitives";

export abstract class VersionedObject {
  public abstract getVersion(): number;
  public abstract get primaryKey(): VolatileStorageKey;
}
