import errorCodes from "./errorCodes"; // TS being dumb

export class IPFSError extends Error {
  protected errorCode: string = errorCodes[IPFSError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
