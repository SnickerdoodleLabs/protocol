import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidURLError extends BaseError {
  protected errorCode: string = errorCodes[InvalidURLError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[InvalidURLError.name], src, false);
  }
}
