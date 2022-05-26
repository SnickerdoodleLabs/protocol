import errorCodes from "@objects/errors/errorCodes";

export class TransferCreationError extends Error {
  protected errorCode: string = errorCodes[TransferCreationError.name];
  constructor(public sourceError?: Error, message?: string) {
    super(message);
  }
}
