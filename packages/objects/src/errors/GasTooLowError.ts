import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class GasTooLowError extends BaseError {
  protected errorCode: string = errorCodes[GasTooLowError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[GasTooLowError.name], src, false);
  }
}
