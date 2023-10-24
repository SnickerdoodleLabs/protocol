import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class TwitterError extends BaseError {
  protected errorCode: string = errorCodes[TwitterError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[TwitterError.name], src, false);
  }
}
