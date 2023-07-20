import errorCodes from "@objects/errors/errorCodes.js";
export class EvalNotImplementedError extends Error {
  protected errorCode: string = errorCodes[EvalNotImplementedError.name];
  constructor(name: string) {
    super(`${name} not implemented`);
  }
}
