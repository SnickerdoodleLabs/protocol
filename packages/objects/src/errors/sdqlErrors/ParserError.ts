import errorCodes from "@objects/errors/errorCodes.js";
export class ParserError extends Error {
  protected errorCode: string = errorCodes[ParserError.name];
  constructor(position: number, message: string) {
    super(`${position}: ${message}`);
  }
}
