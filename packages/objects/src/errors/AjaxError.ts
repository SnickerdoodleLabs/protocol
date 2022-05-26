import errorCodes from "@objects/errors/errorCodes";

export class AjaxError extends Error {
  protected errorCode: string = errorCodes[AjaxError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
