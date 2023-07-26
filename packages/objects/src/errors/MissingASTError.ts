import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class MissingASTError extends BaseError {
  protected errorCode: string = errorCodes[MissingASTError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[MissingASTError.name], src, false);
  }
}
