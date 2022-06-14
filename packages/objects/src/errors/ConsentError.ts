import errorCodes from "@objects/errors/errorCodes";

export class ConsentError extends Error {
  protected errorCode: string = errorCodes[ConsentError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
