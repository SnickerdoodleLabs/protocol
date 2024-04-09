import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class PermissionError extends BaseError {
  protected errorCode: string = errorCodes[PermissionError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[PermissionError.name], src, false);
  }
}
