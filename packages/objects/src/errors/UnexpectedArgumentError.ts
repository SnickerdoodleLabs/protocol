import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class UnexpectedArgumentError extends BaseError {
  protected errorCode: string = errorCodes[UnexpectedArgumentError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[UnexpectedArgumentError.name], src, false);
  }
}
