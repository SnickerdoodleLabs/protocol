import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class SignerUnavailableError extends BaseError {
  protected errorCode: string = errorCodes[SignerUnavailableError.name];
  constructor(message: string) {
    super(message, 500, errorCodes[SignerUnavailableError.name], null, false);
  }
}
