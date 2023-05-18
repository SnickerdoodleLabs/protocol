import errorCodes from "@objects/errors/errorCodes";

export class ProofError extends Error {
  protected errorCode: string = errorCodes[ProofError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
