import { SerializationError } from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import * as serialijse from "serialijse";

import { ISerializer } from "./ISerializer";

export class Serializer implements ISerializer {
  public serialize<T>(obj: T): ResultAsync<string, SerializationError> {
    try {
      return okAsync(serialijse.serialize(obj));
    } catch (err) {
      return errAsync(new SerializationError(`${err}`));
    }
  }

  public deserialize<T>(str: string): ResultAsync<T, SerializationError> {
    try {
      return okAsync(serialijse.deserialize<T>(str));
    } catch (err) {
      return errAsync(new SerializationError(`${err}`));
    }
  }
}
