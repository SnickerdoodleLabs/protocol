import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidSignatureError extends Error {
  protected errorCode: string = errorCodes[InvalidSignatureError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
