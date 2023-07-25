import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class UninitializedError extends BaseError {
  protected errorCode: string = errorCodes[UninitializedError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[UninitializedError.name], src, false);
  }
}
