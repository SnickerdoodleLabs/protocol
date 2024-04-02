import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidStatusError extends BaseError {
  protected errorCode: string = errorCodes[InvalidStatusError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[InvalidStatusError.name], src, false);
  }
}
