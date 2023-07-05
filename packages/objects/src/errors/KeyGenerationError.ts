import errorCodes from "@objects/errors/errorCodes";

export class KeyGenerationError extends Error {
  protected errorCode: string = errorCodes[KeyGenerationError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
