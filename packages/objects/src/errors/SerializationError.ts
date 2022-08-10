import errorCodes from "@objects/errors/errorCodes";

export class SerializationError extends Error {
  protected errorCode: string = errorCodes[SerializationError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}