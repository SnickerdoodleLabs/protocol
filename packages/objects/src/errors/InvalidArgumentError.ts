import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidArgumentError extends BaseError {
  protected errorCode: string = errorCodes[InvalidArgumentError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[InvalidArgumentError.name], src, false);
  }
}
