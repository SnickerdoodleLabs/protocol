import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class MissingArgumentError extends BaseError {
  protected errorCode: string = errorCodes[MissingArgumentError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[MissingArgumentError.name], src, false);
  }
}
