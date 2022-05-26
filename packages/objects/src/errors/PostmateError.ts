import errorCodes from "@objects/errors/errorCodes";

export class PostmateError extends Error {
  protected errorCode: string = errorCodes[PostmateError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
