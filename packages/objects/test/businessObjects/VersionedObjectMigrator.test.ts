import {
  VersionedObject,
  VersionedObjectMigrator,
} from "@objects/businessObjects/index.js";

class TestVersionedObject extends VersionedObject {
  public static CURRENT_VERSION = 3;
  public constructor(
    public foo: number,
    public bar: string,
    public baz: boolean,
  ) {
    super();
  }

  public getVersion(): number {
    return TestVersionedObject.CURRENT_VERSION;
  }
}

class TestVersionedObjectV2 extends VersionedObject {
  public constructor(public foo: number, public bar: string) {
    super();
  }

  public getVersion(): number {
    return 2;
  }
}

class TestVersionedObjectV1 extends VersionedObject {
  public constructor(public foo: number) {
    super();
  }

  public getVersion(): number {
    return 1;
  }
}

class TestVersionedObjectMigrator extends VersionedObjectMigrator<TestVersionedObject> {
  public getCurrentVersion(): number {
    return TestVersionedObject.CURRENT_VERSION;
  }

  public migratorMethodV1Called = false;
  public migratorMethodV2Called = false;

  protected factory(data: Record<string, unknown>): TestVersionedObject {
    return new TestVersionedObject(
      data["foo"] as number,
      data["bar"] as string,
      data["baz"] as boolean,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map([
      [
        1,
        (data, version) => {
          this.migratorMethodV1Called = true;
          data["bar"] = "added string";
          return data;
        },
      ],
      [
        2,
        (data, version) => {
          this.migratorMethodV2Called = true;
          data["baz"] = true;
          return data;
        },
      ],
    ]);
  }
}

describe("VersionedObjectMigrator tests", () => {
  test("getCurrent returns a current object from a record at V3/3", () => {
    // Arrange
    const record = {
      foo: 1,
      bar: "bar",
      baz: false,
    };

    const migrator = new TestVersionedObjectMigrator();
    // Act

    const testObject = migrator.getCurrent(record, 3);

    // Assert
    expect(testObject).toBeInstanceOf(TestVersionedObject);
    expect(testObject.foo).toBe(1);
    expect(testObject.bar).toBe("bar");
    expect(testObject.baz).toBe(false);
    expect(migrator.migratorMethodV1Called).toBeFalsy();
    expect(migrator.migratorMethodV2Called).toBeFalsy();
  });

  test("getCurrent returns a current object from a record at V2/3", () => {
    // Arrange
    const record = {
      foo: 1,
      bar: "bar",
    };

    const migrator = new TestVersionedObjectMigrator();
    // Act

    const testObject = migrator.getCurrent(record, 2);

    // Assert
    expect(testObject).toBeInstanceOf(TestVersionedObject);
    expect(testObject.foo).toBe(1);
    expect(testObject.bar).toBe("bar");
    expect(testObject.baz).toBe(true);
    expect(migrator.migratorMethodV1Called).toBeFalsy();
    expect(migrator.migratorMethodV2Called).toBeTruthy();
  });

  test("getCurrent returns a current object from a record at V1/3", () => {
    // Arrange
    const record = {
      foo: 1,
    };

    const migrator = new TestVersionedObjectMigrator();
    // Act

    const testObject = migrator.getCurrent(record, 1);

    // Assert
    expect(testObject).toBeInstanceOf(TestVersionedObject);
    expect(testObject.foo).toBe(1);
    expect(testObject.bar).toBe("added string");
    expect(testObject.baz).toBe(true);
    expect(migrator.migratorMethodV1Called).toBeTruthy();
    expect(migrator.migratorMethodV2Called).toBeTruthy();
  });
});
