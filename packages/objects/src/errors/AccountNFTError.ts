import errorCodes from "@objects/errors/errorCodes";

export class AccountNFTError extends Error {
  protected errorCode: string = errorCodes[AccountNFTError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
