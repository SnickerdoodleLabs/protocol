import errorCodes from "@objects/errors/errorCodes";

export class LogicalError extends Error {
  protected errorCode: string = errorCodes[LogicalError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
