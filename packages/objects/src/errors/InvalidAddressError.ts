import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidAddressError extends BaseError {
  protected errorCode: string = errorCodes[InvalidAddressError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[InvalidAddressError.name], src, false);
  }
}
