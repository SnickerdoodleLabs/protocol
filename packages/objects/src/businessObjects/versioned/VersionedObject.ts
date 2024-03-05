import { PropertiesOf } from "@objects/utilities/index.js";

export abstract class VersionedObject {
  public abstract getVersion(): number;
}
export abstract class VersionedObjectMigrator<T> {
  public abstract getCurrentVersion(): number;
  protected abstract factory(data: PropertiesOf<T>): T;

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

    return this.factory(data as unknown as PropertiesOf<T>);
  }
}
