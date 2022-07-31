import errorCodes from "@shared/objects/errors/errorCodes";

export class ExtensionMetatransactionError extends Error {
  protected errorCode: string = errorCodes[ExtensionMetatransactionError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
