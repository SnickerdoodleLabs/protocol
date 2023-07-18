import errorCodes from "@objects/errors/errorCodes.js";
import { BaseBEError } from "@objects/errors/BaseBEError.js";

export class NetworkUnreachableError extends BaseBEError {
  protected errorCode: string = errorCodes[NetworkUnreachableError.name];
  constructor(message: string, public src: unknown) {
    super(message, 500, errorCodes[NetworkUnreachableError.name], src, false);
  }
}
