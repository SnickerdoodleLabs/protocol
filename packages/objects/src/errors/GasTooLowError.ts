import errorCodes from "@objects/errors/errorCodes.js";

export class GasTooLowError extends Error {
  protected errorCode: string = errorCodes[GasTooLowError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
