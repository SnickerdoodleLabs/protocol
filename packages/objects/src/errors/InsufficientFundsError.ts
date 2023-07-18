import errorCodes from "@objects/errors/errorCodes.js";
import { BaseBEError } from "@objects/errors/BaseBEError.js";

export class InsufficientFundsError extends BaseBEError {
  protected errorCode: string = errorCodes[InsufficientFundsError.name];
  constructor(message: string, public src: unknown) {
    super(message, 500, errorCodes[InsufficientFundsError.name], src, false);
  }
}
