import errorCodes from "@objects/errors/errorCodes";

export class PermissionError extends Error {
  protected errorCode: string = errorCodes[PermissionError.name];
  constructor(message: string) {
    super(message);
  }
}