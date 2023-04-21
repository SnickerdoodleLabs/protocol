import { inject, injectable } from "inversify";
import { IErrorUtils } from "../../interfaces/utils/IErrorUtils";

@injectable()
export class ErrorUtils implements IErrorUtils {
  constructor() {}

  public emit<T extends Error>(error: T) {}
}
