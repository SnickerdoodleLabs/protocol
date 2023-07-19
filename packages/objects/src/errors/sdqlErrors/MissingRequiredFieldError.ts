import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class MissingRequiredFieldError extends BaseError {
  protected errorCode: string = errorCodes[MissingRequiredFieldError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[MissingRequiredFieldError.name], src, false);
  }
}
