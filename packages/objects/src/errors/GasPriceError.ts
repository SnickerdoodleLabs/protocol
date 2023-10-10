import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class GasPriceError extends BaseError {
  protected errorCode: string = errorCodes[GasPriceError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[GasPriceError.name], src, false);
  }
}
