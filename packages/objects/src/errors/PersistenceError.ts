import errorCodes from "@objects/errors/errorCodes.js";

export class PersistenceError extends Error {
  protected errorCode: string = errorCodes[PersistenceError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
