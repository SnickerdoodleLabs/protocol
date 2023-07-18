import errorCodes from "@objects/errors/errorCodes.js";
import { BaseBEError } from "@objects/errors/BaseBEError.js";

export class UnexpectedArgumentError extends BaseBEError {
  protected errorCode: string = errorCodes[UnexpectedArgumentError.name];
  constructor(message: string, public src: unknown) {
    super(message, 500, errorCodes[UnexpectedArgumentError.name], src, false);
  }
}
