import errorCodes from "@objects/errors/errorCodes.js";

export class UnauthorizedError extends Error {
  protected errorCode: string = errorCodes[UnauthorizedError.name];
  constructor(message?: string, public src?: unknown) {
    if (message == null) {
      message = "Insufficient permissions for operation";
    }
    super(message);
  }
}
