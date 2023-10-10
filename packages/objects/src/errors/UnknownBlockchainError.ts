import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class UnknownBlockchainError extends BaseError {
  protected errorCode: string = errorCodes[UnknownBlockchainError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[UnknownBlockchainError.name], src, false);
  }
}
