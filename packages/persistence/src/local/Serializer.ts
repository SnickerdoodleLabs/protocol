import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import {
  JSONString,
  PersistenceError,
  SerializedObject,
} from "@snickerdoodlelabs/objects";
import { err, ok, Result } from "neverthrow";

export class Serializer {
  public static serialize<T>(
    obj: T,
  ): Result<SerializedObject, PersistenceError> {
    const type = typeof obj;
    switch (type) {
      case "object":
        return ok(new SerializedObject(type, ObjectUtils.serialize(obj)));
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
        return ok(new SerializedObject(type, BigInt(obj as string).toString()));
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
          return ok(ObjectUtils.deserialize<T>(JSONString(serializedObj.data)));
        case "boolean":
          return ok((serializedObj.data === "true") as unknown as T);
        case "number":
          return ok(Number.parseFloat(serializedObj.data) as unknown as T);
        case "string":
          return ok(serializedObj.data as unknown as T);
        case "bigint":
          return ok(BigInt(serializedObj.data) as unknown as T);
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
