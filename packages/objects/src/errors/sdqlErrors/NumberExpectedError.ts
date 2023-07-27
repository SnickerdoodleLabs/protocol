import errorCodes from "@objects/errors/errorCodes.js";
import { OperandTypeError } from "@objects/errors/sdqlErrors/OperandTypeError.js";

export class NumberExpectedError extends OperandTypeError {
  protected errorCode: string = errorCodes[NumberExpectedError.name];
}
