import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class NetworkUnreachableError extends BaseError {
  protected errorCode: string = errorCodes[NetworkUnreachableError.name];
  constructor(message: string, src: unknown) {
    super(message, 500, errorCodes[NetworkUnreachableError.name], src, true);
  }
}
