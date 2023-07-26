import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class InvalidAddressError extends BaseError {
  protected errorCode: string = errorCodes[InvalidAddressError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[InvalidAddressError.name], src, false);
  }
}
