import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class NumberExpectedError extends BaseError {
  protected errorCode: string = errorCodes[NumberExpectedError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[NumberExpectedError.name], src, false);
  }
}
