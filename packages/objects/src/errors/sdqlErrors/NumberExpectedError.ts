import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class NumberExpectedError extends BaseError {
  protected errorCode: string = errorCodes[NumberExpectedError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[NumberExpectedError.name], src, false);
  }
}
