import errorCodes from "@objects/errors/errorCodes";

export class PersistenceError extends Error {
  protected errorCode: string = errorCodes[PersistenceError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
