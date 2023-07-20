import errorCodes from "@objects/errors/errorCodes.js";
import { OperandTypeError } from "@objects/errors/sdqlErrors/OperandTypeError.js";

export class ConditionOperandTypeError extends OperandTypeError {
  protected errorCode: string = errorCodes[ConditionOperandTypeError.name];
}
