import errorCodes from "@objects/errors/errorCodes";

export class ServerError extends Error {
  protected errorCode: string = errorCodes[ServerError.name];
  constructor(
    message: string,
    public statusCode: number,
    public src?: unknown,
  ) {
    super(message);
  }
}
