import errorCodes from "@objects/errors/errorCodes.js";
import { BaseBEError } from "@objects/errors/BaseBEError.js";

export class GasTooLowError extends BaseBEError {
  protected errorCode: string = errorCodes[GasTooLowError.name];
  constructor(message: string, public src: unknown) {
    super(message, 500, errorCodes[GasTooLowError.name], src, false);
  }
}
