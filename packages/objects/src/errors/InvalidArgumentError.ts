import errorCodes from "@objects/errors/errorCodes.js";
import { BaseBEError } from "@objects/errors/BaseBEError.js";

export class InvalidArgumentError extends BaseBEError {
  protected errorCode: string = errorCodes[InvalidArgumentError.name];
  constructor(message: string, public src: unknown) {
    super(message, 500, errorCodes[InvalidArgumentError.name], src, false);
  }
}
