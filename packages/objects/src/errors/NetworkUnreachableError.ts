import errorCodes from "@objects/errors/errorCodes.js";

export class NetworkUnreachableError extends Error {
  protected errorCode: string = errorCodes[NetworkUnreachableError.name];
  public message;
  // TODO: figure out a way to add chainId from the contract level.
  constructor(message: string, public src?: unknown) {
    super(message);
  }
}
