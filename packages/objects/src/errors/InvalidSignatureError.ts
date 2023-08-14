import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class InvalidSignatureError extends BaseError {
  protected errorCode: string = errorCodes[InvalidSignatureError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[InvalidSignatureError.name], src, false);
  }
}
