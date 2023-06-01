import { VolatileStorageKey } from "@objects/primitives";

export abstract class VersionedObject {
  public abstract getVersion(): number;
  public abstract pKey: VolatileStorageKey | null;
}

export abstract class VersionedObjectMigrator<T> {
  public abstract getCurrentVersion(): number;
  public abstract factory(data: Record<string, unknown>): T;

  protected abstract getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  >;

  public getCurrent(data: Record<string, unknown>, version: number): T {
    const funcs = this.getUpgradeFunctions();
    while (version != this.getCurrentVersion()) {
      const func = funcs.get(version);
      if (func != null) {
        data = func(data, version);
      }
      version += 1;
    }

    return this.factory(data);
  }
}
