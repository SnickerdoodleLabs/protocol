import errorCodes from "@objects/errors/errorCodes";

export class CloudStorageError extends Error {
  protected errorCode: string = errorCodes[CloudStorageError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
