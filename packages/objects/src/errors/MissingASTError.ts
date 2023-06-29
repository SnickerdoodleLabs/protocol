import errorCodes from "@objects/errors/errorCodes.js";

export class MissingASTError extends Error {
  protected errorCode: string = errorCodes[MissingASTError.name];
  constructor(public forId: string) {
    super(`No AST found for ${forId}`);
  }
}
