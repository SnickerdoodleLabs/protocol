import errorCodes from "@objects/errors/errorCodes";
import { LanguageCode } from "@objects/primatives";

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
