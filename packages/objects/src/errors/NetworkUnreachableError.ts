import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class NetworkUnreachableError extends BaseError {
  protected errorCode: string = errorCodes[NetworkUnreachableError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[NetworkUnreachableError.name], src, false);
  }
}
