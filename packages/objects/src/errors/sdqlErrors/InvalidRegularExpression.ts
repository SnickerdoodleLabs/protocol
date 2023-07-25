import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidRegularExpression extends Error {
  protected errorCode: string = errorCodes[InvalidRegularExpression.name];
}
