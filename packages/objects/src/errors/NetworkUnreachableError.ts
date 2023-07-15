import errorCodes from "@objects/errors/errorCodes.js";

export class NetworkUnreachableError extends Error {
  protected errorCode: string = errorCodes[NetworkUnreachableError.name];
  public message;
  constructor(message: string, public src?: unknown) {
    super(message);
  }
}
