import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class OperandTypeError extends BaseError {
  protected errorCode: string = errorCodes[OperandTypeError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[OperandTypeError.name], src, false);
  }
}
