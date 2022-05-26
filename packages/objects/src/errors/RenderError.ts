import errorCodes from "@objects/errors/errorCodes";

export class RenderError extends Error {
  protected errorCode: string = errorCodes[RenderError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
