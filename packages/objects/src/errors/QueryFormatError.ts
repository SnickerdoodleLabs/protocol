import errorCodes from "@objects/errors/errorCodes.js";

export class QueryFormatError extends Error {
  protected errorCode: string = errorCodes[QueryFormatError.name];
  constructor(public message: string, public code?: number, public data?: any) {
    super(message);
  }
}
