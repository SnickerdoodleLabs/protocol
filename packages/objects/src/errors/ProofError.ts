import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class ProofError extends BaseError {
  protected errorCode: string = errorCodes[ProofError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[ProofError.name], src, false);
  }
}
