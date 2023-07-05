import errorCodes from "@synamint-extension-sdk/shared/objects/errors/errorCodes";

export class ExtensionStorageError extends Error {
  protected errorCode: string = errorCodes[ExtensionStorageError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
