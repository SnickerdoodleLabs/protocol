import { SerializationError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISerializer {
  serialize<T>(obj: T): ResultAsync<string, SerializationError>;
  deserialize<T>(str: string): ResultAsync<T, SerializationError>;
}

export const ISerializerType = Symbol.for("ISerializer");
