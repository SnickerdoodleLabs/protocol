import errorCodes from "@objects/errors/errorCodes.js";

export class UnknownBlockchainError extends Error {
  protected errorCode: string = errorCodes[UnknownBlockchainError.name];
  public message;
  constructor(message: string, public src?: unknown) {
    super(message);
  }
}
