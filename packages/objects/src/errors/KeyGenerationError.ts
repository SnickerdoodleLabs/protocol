import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class KeyGenerationError extends BaseError {
  protected errorCode: string = errorCodes[KeyGenerationError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[KeyGenerationError.name], src, false);
  }
}
