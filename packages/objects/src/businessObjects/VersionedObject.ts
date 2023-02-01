export abstract class VersionedObject {
  public abstract getVersion(): number;
}

export abstract class VersionedObjectMigrator<T> {
  public abstract getCurrentVersion(): number;
  protected abstract factory(data: Record<string, unknown>): T;

  protected abstract getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  >;

  public getCurrent<T>(data: Record<string, unknown>, version: number) {
    const funcs = this.getUpgradeFunctions();
    while (version != this.getCurrentVersion()) {
      const func = funcs.get(version);
      if (func != null) {
        data = func(data, version);
        version += 1;
      }
    }

    return this.factory(data);
  }
}
