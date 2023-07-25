import errorCodes from "@objects/errors/errorCodes.js";
export class MissingTokenConstructorError extends Error {
  protected errorCode: string = errorCodes[MissingTokenConstructorError.name];
  constructor(name: string) {
    super(`No Token type constructor defined for ${name}`);
  }
}
