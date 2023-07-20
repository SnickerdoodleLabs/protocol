import errorCodes from "@objects/errors/errorCodes.js";
export class MissingRequiredFieldError extends Error {
  protected errorCode: string = errorCodes[MissingRequiredFieldError.name];
  constructor(name: string) {
    super(`${name} not implemented`);
  }
}
