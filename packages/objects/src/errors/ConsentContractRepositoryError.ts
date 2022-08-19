import errorCodes from "@objects/errors/errorCodes";

export class ConsentContractRepositoryError extends Error {
  protected errorCode: string = errorCodes[ConsentContractRepositoryError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
