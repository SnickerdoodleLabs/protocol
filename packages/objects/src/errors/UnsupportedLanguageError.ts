import errorCodes from "@objects/errors/errorCodes.js";
import { LanguageCode } from "@objects/primitives/index.js";

export class UnsupportedLanguageError extends Error {
  protected errorCode: string = errorCodes[UnsupportedLanguageError.name];
  constructor(
    public language: LanguageCode,
    message?: string,
    public src?: unknown,
  ) {
    super(message);
  }
}
