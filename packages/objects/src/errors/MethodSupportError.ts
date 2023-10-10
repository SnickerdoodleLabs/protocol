import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class MethodSupportError extends BaseError {
  protected errorCode: string = errorCodes[MethodSupportError.name];
  constructor(
    message: string,
    public statusCode: number,
    public src?: unknown,
  ) {
    super(message, 500, errorCodes[MethodSupportError.name], src, false);
  }
}
