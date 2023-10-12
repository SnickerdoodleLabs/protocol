import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class ConditionOperandTypeError extends BaseError {
  protected errorCode: string = errorCodes[ConditionOperandTypeError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[ConditionOperandTypeError.name], src, false);
  }
}
