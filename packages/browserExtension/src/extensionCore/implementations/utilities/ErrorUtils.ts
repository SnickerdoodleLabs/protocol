import { IContextProvider, IErrorUtils } from "@interfaces/utilities";

export class ErrorUtils implements IErrorUtils {
  constructor(protected contextProvider: IContextProvider) {}

  public emit<T extends Error>(error: T) {
    this.contextProvider.getErrorSubject().next(error)
  }
}
