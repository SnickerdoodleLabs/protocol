import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class PersistenceError extends BaseError {
  protected errorCode: string = errorCodes[PersistenceError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[PersistenceError.name], src, false);
  }
}
