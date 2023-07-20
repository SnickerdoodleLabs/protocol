import errorCodes from "@objects/errors/errorCodes.js";
import { OperandTypeError } from "@objects/errors/sdqlErrors/OperandTypeError.js";
export class BooleanExpectedError extends OperandTypeError {
  protected errorCode: string = errorCodes[BooleanExpectedError.name];
}
