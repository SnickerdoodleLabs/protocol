import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidArgumentError extends Error {
  protected errorCode: string = errorCodes[InvalidArgumentError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
