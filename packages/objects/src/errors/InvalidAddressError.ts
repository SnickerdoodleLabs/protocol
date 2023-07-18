import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidAddressError extends Error {
  protected errorCode: string = errorCodes[InvalidAddressError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
