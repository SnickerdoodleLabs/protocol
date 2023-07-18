import errorCodes from "@objects/errors/errorCodes.js";
import { BaseBEError } from "@objects/errors/BaseBEError.js";

export class UnknownBlockchainError extends BaseBEError {
  protected errorCode: string = errorCodes[UnknownBlockchainError.name];
  constructor(message: string, public src: unknown) {
    super(message, 500, errorCodes[UnknownBlockchainError.name], src, false);
  }
}
