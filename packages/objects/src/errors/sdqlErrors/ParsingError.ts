import errorCodes from "@objects/errors/errorCodes.js";

export class ParsingError extends Error {
  protected errorCode: string = errorCodes[ParsingError.name];
}
