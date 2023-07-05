import errorCodes from "@objects/errors/errorCodes";

export class TransactionResponseError extends Error {
  protected errorCode: string = errorCodes[TransactionResponseError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
