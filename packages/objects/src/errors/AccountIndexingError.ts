import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class AccountIndexingError extends BaseError {
  protected errorCode: string = errorCodes[AccountIndexingError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[AccountIndexingError.name], src, false);
  }
}
