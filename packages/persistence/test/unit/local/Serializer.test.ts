import "reflect-metadata";
import { SerializedObject } from "@snickerdoodlelabs/objects";

import { Serializer } from "@persistence/local/index.js";

describe("Serializer Tests", () => {
  test("serialize() works for a number", async () => {
    // Arrange
    const val = 7;

    // Act
    const serialized = Serializer.serialize(val);

    // Assert
    expect(serialized.isOk()).toBeTruthy();
    const unwrapped = serialized._unsafeUnwrap();
    expect(unwrapped.type).toBe("number");
    expect(unwrapped.data).toBe("7");
  });

  test("serialize() works for a string", async () => {
    // Arrange
    const val = "Phoebe";

    // Act
    const serialized = Serializer.serialize(val);

    // Assert
    expect(serialized.isOk()).toBeTruthy();
    const unwrapped = serialized._unsafeUnwrap();
    expect(unwrapped.type).toBe("string");
    expect(unwrapped.data).toBe(val);
  });

  test("serialize() works for a boolean", async () => {
    // Arrange
    const val = true;

    // Act
    const serialized = Serializer.serialize(val);

    // Assert
    expect(serialized.isOk()).toBeTruthy();
    const unwrapped = serialized._unsafeUnwrap();
    expect(unwrapped.type).toBe("boolean");
    expect(unwrapped.data).toBe("true");
  });

  // test("serialize() works for a bigint", async () => {
  //   // Arrange
  //   const val = BigInt(1010);

  //   // Act
  //   const serialized = Serializer.serialize(val);

  //   // Assert
  //   expect(serialized.isOk()).toBeTruthy();
  //   const unwrapped = serialized._unsafeUnwrap();
  //   expect(unwrapped.type).toBe("bigint");
  //   expect(unwrapped.data).toEqual(val);
  // });

  test("serialize() works for a object", async () => {
    // Arrange
    const val = { foo: "bar" };

    // Act
    const serialized = Serializer.serialize(val);

    // Assert
    expect(serialized.isOk()).toBeTruthy();
    const unwrapped = serialized._unsafeUnwrap();
    expect(unwrapped.type).toBe("object");
    expect(unwrapped.data).toBe('{"foo":"bar"}');
  });

  test("deserialize() works for a number", async () => {
    // Arrange
    const serialized = new SerializedObject("number", "7");

    // Act
    const val = Serializer.deserialize(serialized);

    // Assert
    expect(val.isOk()).toBeTruthy();
    const unwrapped = val._unsafeUnwrap();
    expect(unwrapped).toBe(7);
  });

  test("deserialize() works for a boolean", async () => {
    // Arrange
    const serialized = new SerializedObject("boolean", "true");

    // Act
    const val = Serializer.deserialize(serialized);

    // Assert
    expect(val.isOk()).toBeTruthy();
    const unwrapped = val._unsafeUnwrap();
    expect(unwrapped).toBe(true);
  });

  test("deserialize() works for a string", async () => {
    // Arrange
    const serialized = new SerializedObject("string", "Phoebe");

    // Act
    const val = Serializer.deserialize(serialized);

    // Assert
    expect(val.isOk()).toBeTruthy();
    const unwrapped = val._unsafeUnwrap();
    expect(unwrapped).toBe("Phoebe");
  });

  test("deserialize() works for an object", async () => {
    // Arrange
    const serialized = new SerializedObject("object", '{"foo":"bar"}');

    // Act
    const val = Serializer.deserialize(serialized);

    // Assert
    expect(val.isOk()).toBeTruthy();
    const unwrapped = val._unsafeUnwrap();
    expect(unwrapped).toEqual({ foo: "bar" });
  });
});
