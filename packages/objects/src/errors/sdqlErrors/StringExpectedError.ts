import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class StringExpectedError extends BaseError {
  protected errorCode: string = errorCodes[StringExpectedError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[StringExpectedError.name], src, false);
  }
}
