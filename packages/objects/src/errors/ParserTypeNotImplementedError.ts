import errorCodes from "@objects/errors/errorCodes.js";

export class ParserTypeNotImplementedError extends Error {
  protected errorCode: string = errorCodes[ParserTypeNotImplementedError.name];
  constructor(public forId: string) {
    super(`No type defined for ${forId}`);
  }
}
