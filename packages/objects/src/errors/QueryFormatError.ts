import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class QueryFormatError extends BaseError {
  protected errorCode: string = errorCodes[QueryFormatError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[QueryFormatError.name], src, false);
  }
}

