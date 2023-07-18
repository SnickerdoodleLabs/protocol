import errorCodes from "@objects/errors/errorCodes.js";
import { BaseBEError } from "@objects/errors/BaseBEError.js";

export class InvalidAddressError extends BaseBEError {
  protected errorCode: string = errorCodes[InvalidAddressError.name];
  constructor(message: string, public src: unknown) {
    super(message, 500, errorCodes[InvalidAddressError.name], src, false);
  }
}
