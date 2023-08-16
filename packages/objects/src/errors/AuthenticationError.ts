import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class AuthenticationError extends BaseError {
  protected errorCode: string = errorCodes.AuthenticationError;
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes.AuthenticationError, src, false);
  }
}
