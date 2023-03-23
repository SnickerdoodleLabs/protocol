import { PersistenceError } from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

export class Serializer {
  public static serialize<T>(
    obj: T,
  ): ResultAsync<SerializedObject, PersistenceError> {
    const type = typeof obj;
    switch (type) {
      case "object":
        return okAsync(new SerializedObject(type, JSON.stringify(obj)));
      case "number":
        return okAsync(
          new SerializedObject(type, (obj as unknown as number).toString()),
        );
      case "string":
        return okAsync(new SerializedObject(type, obj as unknown as string));
      default:
        return errAsync(
          new PersistenceError("unsupported data type for serialization", type),
        );
    }
  }

  public static deserialize<T>(
    serializedObj: SerializedObject,
  ): ResultAsync<T, PersistenceError> {
    try {
      switch (serializedObj.type) {
        case "object":
          return okAsync(JSON.parse(serializedObj.data) as T);
        case "number":
          return okAsync(Number.parseFloat(serializedObj.data) as unknown as T);
        case "string":
          return okAsync(serializedObj.data as unknown as T);
        default:
          return errAsync(
            new PersistenceError(
              "invalid data type for deserialization",
              serializedObj.type,
            ),
          );
      }
    } catch (e) {
      return errAsync(new PersistenceError("error deserializing object", e));
    }
  }
}

export class SerializedObject {
  public constructor(public type: string, public data: string) {}
}
