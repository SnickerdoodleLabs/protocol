import errorCodes from "@objects/errors/errorCodes.js";
import { OperandTypeError } from "@objects/errors/sdqlErrors/OperandTypeError.js";

export class StringExpectedError extends OperandTypeError {
  protected errorCode: string = errorCodes[StringExpectedError.name];
}
