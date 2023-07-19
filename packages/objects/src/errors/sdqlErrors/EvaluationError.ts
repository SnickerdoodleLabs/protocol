import errorCodes from "@objects/errors/errorCodes.js";
export class EvaluationError extends Error {
  protected errorCode: string = errorCodes[EvaluationError.name];
}
