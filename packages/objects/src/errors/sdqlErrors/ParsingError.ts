import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class ParsingError extends BaseError {
  protected errorCode: string = errorCodes[ParsingError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[ParsingError.name], src, false);
  }
}
