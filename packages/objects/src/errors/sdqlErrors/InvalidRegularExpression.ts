import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class InvalidRegularExpression extends BaseError {
  protected errorCode: string = errorCodes[InvalidRegularExpression.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[InvalidRegularExpression.name], src, false);
  }
}
