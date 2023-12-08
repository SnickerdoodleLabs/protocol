import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidNonceError extends BaseError {
  protected errorCode: string = errorCodes[InvalidNonceError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[InvalidNonceError.name], src, true);
  }
}
