import errorCodes from "@objects/errors/errorCodes";

export class RegistryPermissionError extends Error {
  protected errorCode: string = errorCodes[RegistryPermissionError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
