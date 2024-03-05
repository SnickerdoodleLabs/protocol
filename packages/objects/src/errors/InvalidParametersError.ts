import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

/**
 * This error should be returned by a method when the calling parameters are invalid or nonsensical.
 * This is not used for blockchain method cases; see InvalidArgumentError for that.
 */
export class InvalidParametersError extends BaseError {
  protected errorCode: string = errorCodes[InvalidParametersError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[InvalidParametersError.name], src, false);
  }
}
