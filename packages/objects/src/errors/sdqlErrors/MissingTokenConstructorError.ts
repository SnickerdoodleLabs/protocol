import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class MissingTokenConstructorError extends BaseError {
  protected errorCode: string = errorCodes[MissingTokenConstructorError.name];
  constructor(message: string, public src?: unknown) {
    super(
      message,
      500,
      errorCodes[MissingTokenConstructorError.name],
      src,
      false,
    );
  }
}
