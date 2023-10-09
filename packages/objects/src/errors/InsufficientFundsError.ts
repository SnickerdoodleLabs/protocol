import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class InsufficientFundsError extends BaseError {
  protected errorCode: string = errorCodes[InsufficientFundsError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[InsufficientFundsError.name], src, false);
  }
}
