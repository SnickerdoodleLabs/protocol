import { PersistenceError, SerializedObject } from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { err, ok, Result } from "neverthrow";

export class Serializer {
  public static serialize<T>(
    obj: T,
  ): Result<SerializedObject, PersistenceError> {
    const type = typeof obj;
    switch (type) {
      case "object":
        return ok(new SerializedObject(type, JSON.stringify(obj)));
      case "boolean":
        return ok(
          new SerializedObject(type, (obj as unknown as boolean).toString()),
        );
      case "number":
        return ok(
          new SerializedObject(type, (obj as unknown as number).toString()),
        );
      case "string":
        return ok(new SerializedObject(type, obj as unknown as string));
      case "bigint":
        return ok(new SerializedObject(type, BigNumber.from(obj).toString()));
      default:
        return err(
          new PersistenceError("unsupported data type for serialization", type),
        );
    }
  }

  public static deserialize<T>(
    serializedObj: SerializedObject,
  ): Result<T, PersistenceError> {
    try {
      switch (serializedObj.type) {
        case "object":
          return ok(JSON.parse(serializedObj.data) as T);
        case "boolean":
          return ok((serializedObj.data === "true") as unknown as T);
        case "number":
          return ok(Number.parseFloat(serializedObj.data) as unknown as T);
        case "string":
          return ok(serializedObj.data as unknown as T);
        case "bigint":
          return ok(
            BigNumber.from(serializedObj.data).toBigInt() as unknown as T,
          );
        default:
          return err(
            new PersistenceError(
              "invalid data type for deserialization",
              serializedObj.type,
            ),
          );
      }
    } catch (e) {
      return err(new PersistenceError("error deserializing object", e));
    }
  }
}
