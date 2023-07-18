import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class AjaxError extends BaseError {
  protected errorCode: string = errorCodes[AjaxError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[AjaxError.name], src, false);
  }
}
