import errorCodes from "@objects/errors/errorCodes.js";

export class PermissionError extends Error {
  protected errorCode: string = errorCodes[PermissionError.name];
  constructor(message: string) {
    super(message);
  }
}
