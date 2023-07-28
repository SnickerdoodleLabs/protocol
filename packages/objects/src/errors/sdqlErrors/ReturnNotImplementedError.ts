import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class ReturnNotImplementedError extends BaseError {
  protected errorCode: string = errorCodes[ReturnNotImplementedError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[ReturnNotImplementedError.name], src, false);
  }
}
