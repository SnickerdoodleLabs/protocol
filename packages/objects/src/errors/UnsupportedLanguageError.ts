import errorCodes from "@objects/errors/errorCodes.js";
import { LanguageCode } from "@objects/primitives/index.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class UnsupportedLanguageError extends BaseError {
  protected errorCode: string = errorCodes[UnsupportedLanguageError.name];
  constructor(
    public language: LanguageCode,
    message?: string,
    public src?: unknown,
  ) {
    super(message || language, 500, errorCodes[UnsupportedLanguageError.name], src, false);
  }
}
