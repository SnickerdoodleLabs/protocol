import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class ParserTypeNotImplementedError extends BaseError {
  protected errorCode: string = errorCodes[ParserTypeNotImplementedError.name];
  constructor(message: string, public src?: unknown) {
    super(
      message,
      500,
      errorCodes[ParserTypeNotImplementedError.name],
      src,
      false,
    );
  }
}
