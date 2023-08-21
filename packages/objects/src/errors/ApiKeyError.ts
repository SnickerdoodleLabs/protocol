import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class ApiKeyError extends BaseError {
  protected errorCode: string = errorCodes[ApiKeyError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[ApiKeyError.name], src, false);
  }
}
