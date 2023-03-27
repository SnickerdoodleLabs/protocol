import "reflect-metadata";
import { Serializer } from "@persistence/local/index.js";

describe("Serializer Tests", () => {
  test("serializer() works for a number", async () => {
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
});
