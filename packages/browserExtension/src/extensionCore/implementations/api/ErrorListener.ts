import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IErrorListener } from "@interfaces/api";
import { IContextProvider, IContextProviderType } from "@interfaces/utilities";

@injectable()
export class ErrorListener implements IErrorListener {
  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

  public initialize(): ResultAsync<void, never> {
    const errorSubject = this.contextProvider.getErrorSubject();
    errorSubject.subscribe(this.onExtensionError.bind(this));
    return okAsync(undefined);
  }

  private onExtensionError(error: Error) {
    console.log(error);
  }
}
