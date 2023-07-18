import errorCodes from "@objects/errors/errorCodes.js";
import { BaseBEError } from "@objects/errors/BaseBEError.js";

export class MissingArgumentError extends BaseBEError {
  protected errorCode: string = errorCodes[MissingArgumentError.name];
  constructor(message: string, public src: unknown) {
    super(message, 500, errorCodes[MissingArgumentError.name], src, false);
  }
}
