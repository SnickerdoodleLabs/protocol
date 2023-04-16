import errorCodes from "@objects/errors/errorCodes";

export class UnsupportedSignatureTypeError extends Error {
  protected errorCode: string = errorCodes[UnsupportedSignatureTypeError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
