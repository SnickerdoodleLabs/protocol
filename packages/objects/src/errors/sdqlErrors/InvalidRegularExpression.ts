import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidRegularExpression extends BaseError {
  protected errorCode: string = errorCodes[InvalidRegularExpression.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[InvalidRegularExpression.name], src, false);
  }
}
