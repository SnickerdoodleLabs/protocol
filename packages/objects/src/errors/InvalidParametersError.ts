import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidParametersError extends Error {
  protected errorCode: string = errorCodes[InvalidParametersError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
