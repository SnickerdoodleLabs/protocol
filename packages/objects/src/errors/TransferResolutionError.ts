import errorCodes from "@objects/errors/errorCodes";

export class TransferResolutionError extends Error {
  protected errorCode: string = errorCodes[TransferResolutionError.name];
  constructor(public sourceError?: Error, message?: string) {
    super(message);
  }
}
