import errorCodes from "@objects/errors/errorCodes";

export class BlockchainUnavailableError extends Error {
  protected errorCode: string = errorCodes[BlockchainUnavailableError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
