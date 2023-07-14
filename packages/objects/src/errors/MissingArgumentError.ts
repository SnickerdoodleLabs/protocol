import errorCodes from "@objects/errors/errorCodes.js";

export class MissingArgumentError extends Error {
  protected errorCode: string = errorCodes[MissingArgumentError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
