import errorCodes from "@objects/errors/errorCodes.js";
export class ReturnNotImplementedError extends Error {
  protected errorCode: string = errorCodes[ReturnNotImplementedError.name];
  constructor(name: string) {
    super(`Return type for ${name} not implemented`);
  }
}
