import { inject, injectable } from "inversify";

import {
  IContextProvider,
  IContextProviderType,
  IErrorUtils,
} from "@interfaces/utilities";

@injectable()
export class ErrorUtils implements IErrorUtils {
  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

  public emit<T extends Error>(error: T) {
    this.contextProvider.getErrorSubject().next(error);
  }
}
