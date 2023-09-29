import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class ConsentError extends BaseError {
  protected errorCode: string = errorCodes[ConsentError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[ConsentError.name], src, false);
  }
}
