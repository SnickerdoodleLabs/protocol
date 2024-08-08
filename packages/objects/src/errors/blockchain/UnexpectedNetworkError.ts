import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class UnexpectedNetworkError extends BaseError {
  protected errorCode: string = errorCodes[UnexpectedNetworkError.name];
  constructor(message: string, src: unknown) {
    super(message, 500, errorCodes[UnexpectedNetworkError.name], src, true);
  }
}
