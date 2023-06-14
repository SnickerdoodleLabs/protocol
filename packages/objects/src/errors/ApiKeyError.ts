import errorCodes from "@objects/errors/errorCodes";

export class ApiKeyError extends Error {
  protected errorCode: string = errorCodes[ApiKeyError.name];
  constructor(
    message: string,
    public statusCode: number,
    public src?: unknown,
  ) {
    super(message);
  }
}
