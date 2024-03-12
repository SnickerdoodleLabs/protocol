import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidQueryStatusError extends BaseError {
  protected errorCode: string = errorCodes[InvalidQueryStatusError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[InvalidQueryStatusError.name], src, false);
  }
}
