import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class AjaxError extends BaseError {
  protected errorCode: string = errorCodes[AjaxError.name];
  constructor(
    message: string,
    public statusCode: number,
    public src?: unknown,
  ) {
    super(message, 500, errorCodes[AjaxError.name], src, false);
  }
}
