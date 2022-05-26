import errorCodes from "@objects/errors/errorCodes";

export class IPFSUnavailableError extends Error {
  protected errorCode: string = errorCodes[IPFSUnavailableError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
