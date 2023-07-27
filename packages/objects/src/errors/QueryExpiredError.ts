import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class QueryExpiredError extends BaseError {
  protected errorCode: string = errorCodes[QueryExpiredError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[QueryExpiredError.name], src, false);
  }
}
