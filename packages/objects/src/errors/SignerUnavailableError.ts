import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class SignerUnavailableError extends BaseError {
  protected errorCode: string = errorCodes[SignerUnavailableError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[SignerUnavailableError.name], src, false);
  }
}
