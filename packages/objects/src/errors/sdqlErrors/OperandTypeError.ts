import errorCodes from "@objects/errors/errorCodes.js";

export class OperandTypeError extends TypeError {
  protected errorCode: string = errorCodes[OperandTypeError.name];
  constructor(message: string) {
    super(message);
  }
}
