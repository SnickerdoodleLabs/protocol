import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class ParserError extends BaseError {
  protected errorCode: string = errorCodes[ParserError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[ParserError.name], src, false);
  }
}