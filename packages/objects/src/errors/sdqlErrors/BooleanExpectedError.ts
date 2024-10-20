import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class BooleanExpectedError extends BaseError {
  protected errorCode: string = errorCodes[BooleanExpectedError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[BooleanExpectedError.name], src, false);
  }
}
