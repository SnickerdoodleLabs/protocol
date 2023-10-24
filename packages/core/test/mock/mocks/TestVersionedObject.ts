import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@snickerdoodlelabs/objects";

export class TestVersionedObject extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(public keyVal: string, public otherVal: number) {
    super();
  }

  public getVersion(): number {
    return TestVersionedObject.CURRENT_VERSION;
  }
}

export class TestMigrator extends VersionedObjectMigrator<TestVersionedObject> {
  public getCurrentVersion(): number {
    return TestVersionedObject.CURRENT_VERSION;
  }

  protected factory(data: Record<string, unknown>): TestVersionedObject {
    return new TestVersionedObject(
      data["keyVal"] as string,
      data["otherVal"] as number,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
