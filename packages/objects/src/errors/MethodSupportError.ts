import errorCodes from "@objects/errors/errorCodes";

export class MethodSupportError extends Error {
  protected errorCode: string = errorCodes[MethodSupportError.name];
  constructor(
    message: string,
    public statusCode: number,
    public src?: unknown,
  ) {
    super(message);
  }
}
