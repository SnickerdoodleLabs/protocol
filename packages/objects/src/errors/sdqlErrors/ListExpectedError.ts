import errorCodes from "@objects/errors/errorCodes.js";
import { OperandTypeError } from "@objects/errors/sdqlErrors/OperandTypeError.js";

export class ListExpectedError extends OperandTypeError {
  protected errorCode: string = errorCodes[ListExpectedError.name];
}
