import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class URLExpectedError extends BaseError {
  protected errorCode: string = errorCodes[URLExpectedError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[URLExpectedError.name], src, false);
  }
}
