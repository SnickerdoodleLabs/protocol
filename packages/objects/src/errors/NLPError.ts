import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class NLPError extends BaseError {
  protected errorCode: string = errorCodes[NLPError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[NLPError.name], src, false);
  }
}
