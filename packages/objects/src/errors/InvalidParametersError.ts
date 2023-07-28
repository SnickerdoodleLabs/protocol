import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class InvalidParametersError extends BaseError {
  protected errorCode: string = errorCodes[InvalidParametersError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[InvalidParametersError.name], src, false);
  }
}
